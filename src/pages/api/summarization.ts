import { AzureKeyCredential, DocumentAnalysisClient } from '@azure/ai-form-recognizer';
import { TextAnalyticsClient } from '@azure/ai-text-analytics';
import { RestError } from '@azure/core-http';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { createDbIfNotExists, ensureSession } from '~/helpers';
import { sessionOptions, SummarizationData } from '~/models';

const keyFormRecognizer = process.env.FORM_RECOGNIZER_KEY || '';
const endpointFormRecognizer = process.env.FORM_RECOGNIZER_ENDPOINT || '';
const keyLanguageService = process.env.LANGUAGE_SERVICE_KEY || '';
const endpointLanguageService = process.env.LANGUAGE_SERVICE_ENDPOINT || '';

const MAX_SENTENCE_COUNT = 5;
const TITLE_SUMMARY = 'Summarization';

const clientFormRecognizer = new DocumentAnalysisClient(
  endpointFormRecognizer,
  new AzureKeyCredential(keyFormRecognizer)
);
const clientLanguageService = new TextAnalyticsClient(
  endpointLanguageService,
  new AzureKeyCredential(keyLanguageService)
);

async function saveData(summary: string, title: string, req: NextApiRequest) {
  const session = req.session.user;
  const container = await createDbIfNotExists();
  if (session && container && title) {
    container.items.create({ gitHubUser: session?.login, summarization: { summary: summary, title: title } });
  }
}

async function summarizationRouter(req: NextApiRequest, res: NextApiResponse<SummarizationData | RestError>) {
  try {
    ensureSession(req);

    const title = req.query?.fileName.toString() || TITLE_SUMMARY;

    const pollerDocumentAnalytics = await clientFormRecognizer.beginAnalyzeDocument('prebuilt-document', req);
    const result = await pollerDocumentAnalytics.pollUntilDone();

    const content = result.content;

    const documents = [content];

    const actions = {
      extractSummaryActions: [{ modelVersion: 'latest', orderBy: 'Rank', maxSentenceCount: MAX_SENTENCE_COUNT }]
    };

    const poller = await clientLanguageService.beginAnalyzeActions(documents, actions, 'en');

    const resultPages = await poller.pollUntilDone();

    let textToDisplay = '';
    for await (const page of resultPages) {
      const extractSummaryAction = page.extractSummaryResults[0];

      if (!extractSummaryAction.error) {
        for (const doc of extractSummaryAction.results) {
          if (!doc.error) {
            for (const sentence of doc.sentences) {
              console.log(`\t- ${sentence.text}`);
              textToDisplay = textToDisplay + ` ${sentence.text}`;
            }
          } else {
            console.error('\tError:', doc.error);
          }
        }
      }
    }

    saveData(textToDisplay, title, req);

    res.status(200).json({ content: textToDisplay, title: title as string });
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

export default withIronSessionApiRoute(summarizationRouter, sessionOptions);

export const config = {
  api: {
    bodyParser: false
  }
};
