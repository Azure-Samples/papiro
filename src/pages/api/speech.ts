// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { RestError } from '@azure/core-http';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ensureSession } from '~/helpers';
import { sessionOptions, SpeechTokenData } from '~/models';
const keySpeechService = process.env.SPEECH_SERVICE_KEY || '';
const speechServiceRegion = process.env.SPEECH_SERVICE_REGION || '';

async function speech(req: NextApiRequest, res: NextApiResponse<SpeechTokenData | RestError>) {
  try {
    ensureSession(req);

    const response = await fetch(`https://${speechServiceRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': keySpeechService,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = await response.text();

    res.status(200).json({ token: data, region: speechServiceRegion });
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

export default withIronSessionApiRoute(speech, sessionOptions);
