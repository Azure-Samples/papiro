import { AzureKeyCredential, TextAnalyticsClient } from '@azure/ai-text-analytics';
import { RestError } from '@azure/core-http';
import { withIronSessionApiRoute } from 'iron-session/next';
import { SpeechConfig } from 'microsoft-cognitiveservices-speech-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { createDbIfNotExists, ensureSession } from '~/helpers';
import { FeedbackData, FeedbackSentiment, sessionOptions } from '~/models';
const keySpeechService = process.env.SPEECH_SERVICE_KEY || '';
const endpointServiceRegion = process.env.SPEECH_SERVICE_REGION || '';
const keyLanguageService = process.env.LANGUAGE_SERVICE_KEY || '';
const endpointLanguageService = process.env.LANGUAGE_SERVICE_ENDPOINT || '';

const speechConfig = SpeechConfig.fromSubscription(keySpeechService, endpointServiceRegion);
speechConfig.speechRecognitionLanguage = 'en-US';

const clientLanguageService = new TextAnalyticsClient(
  endpointLanguageService,
  new AzureKeyCredential(keyLanguageService)
);

async function saveData(sentiment: string, feedbackContent: string, req: NextApiRequest) {
  const session = req.session.user;
  const container = await createDbIfNotExists();
  if (sentiment && feedbackContent && session) {
    container.items.create({
      gitHubUser: session?.login,
      feedback: { sentiment: sentiment, feedbackContent: feedbackContent }
    });
  }
}

async function translationRouter(req: NextApiRequest, res: NextApiResponse<FeedbackData | RestError>) {
  try {
    ensureSession(req);

    const { text } = await req.body;

    const documents = [text];
    const sentimentResult = await clientLanguageService.analyzeSentiment(documents);

    let sentiment = FeedbackSentiment.neutral;

    if (sentimentResult) {
      sentiment = FeedbackSentiment[(sentimentResult[0] as any).sentiment as FeedbackSentiment];
    }

    saveData(sentiment, text, req);

    res.status(200).json({
      sentiment,
      text
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
