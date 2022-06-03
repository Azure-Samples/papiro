// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { NextPage } from 'next';
import { fetchJson } from '~/helpers';
import { useTranslation } from 'next-i18next';
import { Layout, CompletionResult } from '~/components';
import { FormEvent, useCallback, useState } from 'react';
import { GenerationReq, GenerationData } from '~/models';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Generation: NextPage = () => {
  const { t } = useTranslation('common');
  const [rendering, setRendering] = useState<boolean>(false);
  const [request, setRequest] = useState<GenerationReq>({
    prompt: 'This conference is awesome because',
    count: 3,
    length: 75
  });

  const [completion, setCompletion] = useState<GenerationData | undefined>(undefined);

  const getFieldValue = (collection: HTMLFormControlsCollection, name: string) =>
    (collection.namedItem(name) as HTMLInputElement).value;

  const getCompletion = useCallback((req: GenerationReq) => {
    if (!req) {
      return;
    }

    return fetchJson<GenerationData>('/api/generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
  }, []);

  const onSubmitCompletion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;

    try {
      setRendering(true);
      setCompletion(undefined);

      const req: GenerationReq = {
        prompt: getFieldValue(formElements, 'completionPrompt'),
        count: parseInt(getFieldValue(formElements, 'completionCount')),
        length: parseInt(getFieldValue(formElements, 'completionLength'))
      };

      setRequest(req);

      const generatedCopy = await getCompletion(req);

      if (generatedCopy) {
        setCompletion(generatedCopy);
      }

      setRendering(false);
    } catch (error) {
      console.error('An unexpected error happened:', error);
      setRendering(false);
    }
  };

  return (
    <Layout>
      <div className="container flex flex-col justify-center mx-auto  max-w-4xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('generation.title')}</h2>
        <div className="flex-auto mt-2">
          <form onSubmit={onSubmitCompletion}>
            <div className="mb-4 flex items-center justify-between">
              <input
                className="w-full shadow appearance-none border rounded ml-0 mr-2 py-2 px-3 text-gray-700 text-xl focus:outline-none focus:shadow-outline"
                name="completionPrompt"
                id="completionPrompt"
                type="text"
                defaultValue={request.prompt}
                disabled={rendering}
              />
              <input
                className="w-16 mr-2 shadow appearance-none border rounded ml-0 py-2 px-3 text-gray-700 text-xl focus:outline-none focus:shadow-outline"
                name="completionCount"
                id="completionCount"
                type="text"
                defaultValue={request.count}
                disabled={rendering}
              />
              <input
                className="w-16 mr-2 shadow appearance-none border rounded ml-0 py-2 px-3 text-gray-700 text-xl focus:outline-none focus:shadow-outline"
                name="completionLength"
                id="completionLength"
                type="text"
                defaultValue={request.length}
                disabled={rendering}
              />

              <button
                className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 text-xl rounded focus:outline-none focus:shadow-outline"
                name="generateCompletion"
                id="generateCompletion"
                type="submit"
                disabled={rendering}
              >
                {rendering ? t('generation.working') : t('generation.generate')}
              </button>
            </div>
            <div className="mb-4 flex items-center justify-items-start justify-between">
              <CompletionResult request={request} results={completion} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

export default Generation;
