import { RestError } from '@azure/core-http';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ensureSession, getCosmosDbContainer } from '~/helpers';
import { getBlobServiceClient, SOURCE_CONTAINER_NAME, TARGET_CONTAINER_NAME } from '~/helpers/blob-service';
import { sessionOptions, translationLanguages } from '~/models';

async function cleanContainer(sourceFileName: string) {
  const blobServiceClient = getBlobServiceClient();
  const sourceBlobContainerClient = blobServiceClient.getContainerClient(SOURCE_CONTAINER_NAME);
  await sourceBlobContainerClient.getBlockBlobClient(sourceFileName).deleteIfExists();

  translationLanguages.forEach(async (lang) => {
    const sourceBlobContainerClient = blobServiceClient.getContainerClient(`${TARGET_CONTAINER_NAME}${lang}`);
    await sourceBlobContainerClient.getBlockBlobClient(sourceFileName).deleteIfExists();
  });
}

async function resetRouter(req: NextApiRequest, res: NextApiResponse<boolean | RestError>) {
  try {
    ensureSession(req);

    const session = req.session.user;

    if (session) {
      const container = getCosmosDbContainer();

      const { resources } = await container.items
        .query({
          query: 'SELECT * from c WHERE c.gitHubUser = @gitHubUser',
          parameters: [{ name: '@gitHubUser', value: session.login }]
        })
        .fetchAll();

      for (const item of resources) {
        if (item.translation) {
          await cleanContainer(item.translation.source);
        }
        container.item(item.id, session.login).delete();
      }
    }

    res.status(200).json(true);
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

export default withIronSessionApiRoute(resetRouter, sessionOptions);
