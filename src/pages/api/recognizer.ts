// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
// The SDK is not yet compatible with '2022-03-31-preview that why we have to overwrite some methods
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
  DocumentField,
  FormRecognizerApiVersion,
  PrebuiltModels
} from '@azure/ai-form-recognizer';
import { RestError } from '@azure/core-http';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { createDbIfNotExists, ensureSession } from '~/helpers';
import { RecognizerData, RecognizerVaccine, sessionOptions } from '~/models';

const key = process.env.FORM_RECOGNIZER_KEY || '';
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT || '';

const API_VERSION = '2022-03-31-preview';

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key), {
  apiVersion: API_VERSION as FormRecognizerApiVersion
});

// The SDK is not yet compatible with '2022-03-31-preview that why we have to overwrite some methods
const sendOperationRequest = client._restClient.sendOperationRequest;
client._restClient.sendOperationRequest = (operationArguments, operationSpec) => {
  if (operationSpec?.queryParameters) {
    operationSpec.queryParameters.forEach((parameter) => {
      if (parameter.parameterPath !== 'apiVersion') {
        return;
      }

      parameter.mapper.defaultValue = API_VERSION;
    });
  }

  const response = sendOperationRequest.apply(client._restClient, [operationArguments, operationSpec]);
  return response;
};

function getVaccineInformation(vaccines: RecognizerVaccine[]) {
  const results = {};

  vaccines.forEach((vaccine, index) => {
    if (!vaccine.properties) {
      return;
    }

    results[`vaccine${index}Date`] = vaccine.properties.DateAdministered;
    results[`vaccine${index}Manufacturer`] = vaccine.properties.Manufacturer;
  });

  return results;
}
async function saveData(data: any, req: NextApiRequest) {
  const session = req.session.user;
  const container = await createDbIfNotExists();
  if (data && session) {
    container.items.create({ gitHubUser: session?.login, recognizer: data });
  }
}

async function recognizerRouter(req: NextApiRequest, res: NextApiResponse<RecognizerData | RestError>) {
  try {
    ensureSession(req);

    const model = req.query?.model || PrebuiltModels.IdentityDocument;
    const poller = await client.beginAnalyzeDocument(model as string, req);
    const result = await poller.pollUntilDone();

    if (result.documents?.length < 1 && result.entities?.length < 1) {
      throw new Error('Cannot find results');
    }

    if (result.documents?.length > 0 && result.documents[0].fields?.machineReadableZone) {
      const zone = result.documents[0].fields?.machineReadableZone as {
        properties: {
          [key: string]: DocumentField;
        };
      };

      saveData(zone?.properties, req);
      return res.status(200).json(zone?.properties);
    }

    if (result.documents?.length > 0 && result.documents[0].fields?.Vaccines) {
      // SDK not supporting vaccines yet
      const fields: any = result.documents[0].fields;
      const results = {
        ...fields.CardHolderInfo.properties,
        HealthAgency: fields.HealthAgency,
        ...getVaccineInformation(fields.Vaccines.values)
      };

      saveData(results, req);
      return res.status(200).json(results);
    }

    if (result.documents?.length > 0) {
      saveData(result.documents[0].fields, req);
      return res.status(200).json(result.documents[0].fields);
    }

    // On this scenario we don't know the name of the fields
    saveData(result.entities, req);
    return res.status(200).json(result.entities);
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

export default withIronSessionApiRoute(recognizerRouter, sessionOptions);

export const config = {
  api: {
    bodyParser: false
  }
};
