import { RestError } from '@azure/core-http';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ensureSession } from '~/helpers';
import { sessionOptions, TranslationStatusData } from '~/models';

const translatorKey = process.env.TRANSLATION_SERVICE_KEY || '';

async function translationStatusRouter(req: NextApiRequest, res: NextApiResponse<TranslationStatusData | RestError>) {
  try {
    ensureSession(req);

    const response = await fetch(req.query?.url as string, {
      headers: {
        'Ocp-Apim-Subscription-Key': translatorKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    res.status(200).json(data.value);
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

export default withIronSessionApiRoute(translationStatusRouter, sessionOptions);
