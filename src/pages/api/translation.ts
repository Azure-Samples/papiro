import { RestError } from '@azure/core-http';
import {
  BlobSASPermissions,
  ContainerClient,
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential
} from '@azure/storage-blob';
import { randomUUID } from 'crypto';
import { addDays } from 'date-fns';
import formidable, { File } from 'formidable';
import { readFileSync } from 'fs';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ensureSession, getBlobServiceClient, SOURCE_CONTAINER_NAME, TARGET_CONTAINER_NAME } from '~/helpers';
import { createDbIfNotExists } from '~/helpers/database-context';
import {
  sessionOptions,
  TranslationData,
  translationLanguages,
  TranslationLink,
  TranslationTargetLink,
  User
} from '~/models';

const storageAccountKey = process.env.STORAGE_ACCOUNT_KEY || '';
const storageAccount = process.env.STORAGE_ACCOUNT_NAME || '';
const translatorKey = process.env.TRANSLATION_SERVICE_KEY || '';
const translatorEndpoint = process.env.TRANSLATION_SERVICE_NAME || '';
const storageAccountUrl = `https://${storageAccount}.blob.core.windows.net`;
const translatorDocumentEndpoint = `${translatorEndpoint}translator/text/batch/v1.0`;

//const SOURCE_CONTAINER_NAME = 'source';
const POLLING_TIME = 1000;

//Client to shared storage account
const certificates = new StorageSharedKeyCredential(storageAccount, storageAccountKey);

async function parseFile(req: NextApiRequest): Promise<File> {
  const form = new formidable.IncomingForm();

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      resolve(files.file as File);
    });
  });
}

function generateTranslationLinks(sourceFileName: string, sourceBlobContainerClient: ContainerClient) {
  const responseLinks: TranslationLink[] = [];
  const translationTargets: TranslationTargetLink[] = [];

  const now = new Date();
  const startsOn = addDays(now, -1);
  const expiresOn = addDays(now, +1);

  translationLanguages.forEach((lang) => {
    const containerName = `${TARGET_CONTAINER_NAME}${lang}`;
    const containerSasUrl = generateBlobSASQueryParameters(
      {
        containerName: containerName,
        permissions: ContainerSASPermissions.from({ read: true, write: true, list: true }),
        startsOn,
        expiresOn
      },
      certificates
    ).toString();

    translationTargets.push({
      targetUrl: `${storageAccountUrl}/${containerName}?${containerSasUrl}`,
      language: lang
    });

    responseLinks.push({
      url: `${storageAccountUrl}/${containerName}/${sourceFileName}?${containerSasUrl}`,
      language: lang
    });
  });

  const sourceBlobSAS = generateBlobSASQueryParameters(
    {
      containerName: SOURCE_CONTAINER_NAME,
      blobName: sourceFileName,
      permissions: BlobSASPermissions.from({ read: true }),
      startsOn,
      expiresOn
    },
    certificates
  ).toString();

  const sourceFileSasUrl = `${sourceBlobContainerClient.url}/${encodeURIComponent(sourceFileName)}?${sourceBlobSAS}`;

  return { responseLinks, translationTargets, sourceFileSasUrl };
}

async function getUrlForCurrentBatches(sourceFileSasUrl: string, translationTargets: TranslationTargetLink[]) {
  const translationFileRequestBody = {
    inputs: [
      {
        storageType: 'File',
        source: {
          sourceUrl: sourceFileSasUrl
        },
        targets: translationTargets
      }
    ]
  };

  const response = await fetch(`${translatorDocumentEndpoint}/batches`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': translatorKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(translationFileRequestBody)
  });

  return `${response.headers.get('operation-location')}/documents`;
}

async function saveData(sourceFileName: string, responseLinks: TranslationLink[], req: NextApiRequest) {
  const session = req.session.user;
  const container = await createDbIfNotExists();

  if (session && container) {
    container.items.create({
      gitHubUser: session?.login,
      translation: { source: sourceFileName, targets: responseLinks }
    });
  }
}

async function translationRouter(req: NextApiRequest, res: NextApiResponse<TranslationData | RestError>) {
  try {
    ensureSession(req);

    const file = await parseFile(req);
    const bufferFile = readFileSync(file.filepath);
    const sourceFileName = `${(req.session.user as User).login}-${randomUUID()}-${file.originalFilename}`;

    const blobServiceClient = getBlobServiceClient();
    const sourceBlobContainerClient = blobServiceClient.getContainerClient(SOURCE_CONTAINER_NAME);
    const sourceBlockBlobClient = sourceBlobContainerClient.getBlockBlobClient(sourceFileName);
    await sourceBlockBlobClient.upload(bufferFile, file.size);

    const { responseLinks, translationTargets, sourceFileSasUrl } = generateTranslationLinks(
      sourceFileName,
      sourceBlobContainerClient
    );

    saveData(sourceFileName, responseLinks, req);

    const batchUrl = await getUrlForCurrentBatches(sourceFileSasUrl, translationTargets);

    res.status(200).json({
      statusUrl: batchUrl,
      links: responseLinks
    });
  } catch (error) {
    const e = <RestError>error;
    res.status(500).json({
      code: e.code,
      details: e.details,
      message: e.message,
      name: e.name,
      statusCode: e.statusCode
    });
  }
}

export default withIronSessionApiRoute(translationRouter, sessionOptions);

export const config = {
  api: {
    bodyParser: false
  }
};
