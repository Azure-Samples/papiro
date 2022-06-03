// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useState } from 'react';
import { FileUploader, Layout } from '~/components';
import { fetchJson } from '~/helpers';
import { SummarizationData } from '~/models';

const Summarization: NextPage = () => {
  const { t } = useTranslation('common');
  const [file, setFile] = useState<ArrayBuffer | null>();
  const [fileName, setFileName] = useState<string>();
  const [data, setData] = useState<SummarizationData | null>();

  useEffect(() => {
    async function uploadFileOnLoaded() {
      if (!file) {
        return;
      }

      const response = await fetchJson<SummarizationData>(
        `/api/summarization/${fileName ? `?fileName=${fileName}` : ''}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          body: file
        }
      );

      setData(response);
    }

    uploadFileOnLoaded();
  }, [file, fileName]);

  const onDropFile = useCallback(async (file: File) => {
    const contents = await file.arrayBuffer();
    setFile(contents);
    setFileName(file.name);
  }, []);

  const onClickReset = useCallback(() => {
    setData(null);
    setFile(null);
  }, []);

  return (
    <Layout>
      <div className="container flex justify-center items-center mx-auto max-w-4xl">
        {!data ? (
          <FileUploader onDropFile={onDropFile} file={file} placeholder={t('summarization.drag')} />
        ) : (
          <div className="w-full lg:ml-6 p-6 flex flex-col justify-start">
            <div>
              <button
                type="button"
                className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2   focus:outline-none mt-6"
                onClick={onClickReset}
              >
                {t('summarization.reset')}
              </button>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-500 mt-12">{data.title}</h2>
            <p className="mt-6 font-normal text-gray-500 text-lg">{data.content}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

export default Summarization;
