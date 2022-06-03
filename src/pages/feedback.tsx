// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  AudioConfig,
  Recognizer,
  ResultReason,
  SpeechConfig,
  SpeechRecognitionEventArgs,
  SpeechRecognizer
} from 'microsoft-cognitiveservices-speech-sdk';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Layout, Loading } from '~/components';
import { fetchJson } from '~/helpers';
import { FeedbackData, FeedbackSentiment, SpeechTokenData } from '~/models';

const TIME_TO_ANALYZE = 1000;

const Feedback: NextPage = () => {
  const { t } = useTranslation('common');
  const [text, setText] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState<FeedbackData | null>();
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);

  async function getSpeechToken() {
    return await fetchJson<SpeechTokenData>('/api/speech');
  }

  const getSentimentFromSpeech = useCallback((text: string) => {
    if (!text) {
      return;
    }

    return fetchJson<FeedbackData>('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
  }, []);

  useEffect(() => {
    async function startFromMicrophone() {
      if (!isRecording || text) {
        return;
      }

      const tokenData = await getSpeechToken();
      const speechConfig = SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

      const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizing = (sender: Recognizer, event: SpeechRecognitionEventArgs) => {
        const result = event.result;

        if (result.reason === ResultReason.RecognizedSpeech || result.reason === ResultReason.RecognizingSpeech) {
          setText(result.text);
        } else {
          setText(text ? text : t('feedback.no-text'));
          setIsRecording(false);
        }
      };

      recognizer.recognized = (sender: Recognizer, event: SpeechRecognitionEventArgs) => {
        const result = event.result;

        setText(result.text);
        setIsRecording(false);
      };

      // Mandatory to trigger events
      recognizer.recognizeOnceAsync(() => null);
    }

    startFromMicrophone();
  }, [isRecording, t, text]);

  const analyzeSentiment = useCallback(
    async (text) => {
      const response = await getSentimentFromSpeech(text || '');

      setData(response);
    },
    [getSentimentFromSpeech]
  );

  useEffect(() => {
    if (!text || isRecording) {
      return;
    }

    analyzeSentiment(text);
  }, [analyzeSentiment, isRecording, text]);

  const onClickStartOrStop = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setText('');
    setData(null);
  }, [isRecording]);

  const resetDemo = async () => {
    setIsResetLoading(true);
    await fetchJson<FeedbackData>('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    setIsResetLoading(false);
  };

  const SentimentComponent = {
    [FeedbackSentiment.positive]: () => (
      <div className="bg-info-50 border border-info-500 text-info-500 rounded-md py-2 px-4 font-medium">
        {t('feedback.positive')}
        <span className="px-2 inline-block">
          <Image src="/images/positive.svg" width={16} height={16} alt={t('feedback.positive')} />
        </span>
      </div>
    ),
    [FeedbackSentiment.negative]: () => (
      <div className="bg-gray-50 border border-danger-500 text-danger-500 rounded-md py-2 px-4 font-medium">
        {t('feedback.negative')}
        <span className="px-2 inline-block">
          <Image src="/images/negative.svg" width={16} height={16} alt={t('feedback.negative')} />
        </span>
      </div>
    ),
    [FeedbackSentiment.neutral]: () => (
      <div className="bg-info-50 border border-gray-900 text-gray-900 rounded-md py-2 px-4 font-medium">
        {t('feedback.neutral')}
        <span className="px-2 inline-block translate-y-0.5">
          <Image src="/images/neutral.svg" width={16} height={16} alt={t('feedback.neutral')} />
        </span>
      </div>
    )
  };

  return (
    <Layout>
      {isResetLoading ? (
        <div className="w-full text-center py-5 font-bold">
          <Loading size={1.25}>
            <span className="mx-2">{t('shared.loading')}</span>
          </Loading>
        </div>
      ) : (
        <div className="container flex flex-col justify-center items-center mx-auto  max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('feedback.title')}</h2>

          <div
            className={`recorder ${
              isRecording ? 'is-recording' : ''
            } mt-10 cursor-pointer rounded-full h-32 w-32 relative transition-colors bg-info-500 hover:bg-info-600`}
            onClick={onClickStartOrStop}
          ></div>

          {text && text.length > 1 && (
            <>
              <div className="bg-white border border-gray-200 rounded-md p-2 py-3 text-gray-500 my-8 max-w-2xl h-32 w-screen">
                <span className="uppercase">{text?.slice(0, 1)}</span>
                {text?.slice(1)}
              </div>

              {data && <div>{data.sentiment && SentimentComponent[data.sentiment]()}</div>}
            </>
          )}
        </div>
      )}
      <div className="absolute bottom-0 right-0 m-10 w-15 h-15 hover:bg-info-300 bg-info-200 rounded-full transition-colors">
        <button
          type="button"
          className="mr-30 p-2.5 inline-flex items-center hover:brightness-200 filter"
          onClick={resetDemo}
          disabled={isResetLoading}
        >
          <Image src="/images/reset.svg" width={20} height={20} alt="reset" />
        </button>
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

export default Feedback;
