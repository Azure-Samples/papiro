import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useState } from 'react';
import { FileUploader, Layout, TranslationCard } from '~/components';
import { fetchJson } from '~/helpers';
import { TranslationData, TranslationLink, TranslationStatus, TranslationStatusData } from '~/models';

const POLLING_TIME = 2500;

const Translation: NextPage = () => {
  const { t } = useTranslation('common');
  const [file, setFile] = useState<Blob | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>();
  const [data, setData] = useState<TranslationData | null>();
  const [statusData, setStatusData] = useState<TranslationStatusData | null>();

  const onClickChangeDocument = useCallback(() => {
    setFile(null);
    setFileBuffer(null);
    setStatusData(null);
    setData(null);
    setIsLoadingStatus(false);
    setIsLoading(false);
  }, []);

  const onDropFile = useCallback(async (file: File) => {
    setFile(file);
    setFileBuffer(await file.arrayBuffer());
  }, []);

  const getStatus = useCallback(
    (link: TranslationLink): TranslationStatus => {
      if (!statusData) {
        return TranslationStatus.NotStarted;
      }

      const currentLinkStatus = statusData.find((statusLink) => statusLink.to === link.language);

      if (!currentLinkStatus) {
        return TranslationStatus.Failed;
      }

      return currentLinkStatus.status;
    },
    [statusData]
  );

  useEffect(() => {
    async function translateDocumentOnLoadFile() {
      if (!file || isLoading || isLoadingStatus || statusData) {
        return;
      }

      setIsLoading(true);

      const form = new FormData();
      form.append('file', file);

      const response = await fetchJson<TranslationData>('/api/translation', {
        method: 'POST',
        body: form
      });

      setData(response);
      setIsLoading(false);
    }

    translateDocumentOnLoadFile();
  }, [file, isLoading, isLoadingStatus, statusData]);

  useEffect(() => {
    async function checkDocumentStatusIteration(lastTime: number) {
      const now = performance.now();

      if (now - lastTime < POLLING_TIME) {
        requestAnimationFrame(() => checkDocumentStatusIteration(lastTime));
        return;
      }

      const response = await fetchJson<TranslationStatusData>(
        `/api/translationstatus?url=${data?.statusUrl}&time=${lastTime}`
      );

      setStatusData(response);

      if (
        response.every(
          (item) => item.status !== TranslationStatus.Running && item.status !== TranslationStatus.NotStarted
        )
      ) {
        setIsLoadingStatus(false);
        return;
      }

      requestAnimationFrame(() => checkDocumentStatusIteration(now));
    }

    async function checkDocumentsStatus() {
      if (!data || statusData || isLoading || isLoadingStatus) {
        return;
      }

      setIsLoadingStatus(true);
      requestAnimationFrame(() => checkDocumentStatusIteration(performance.now()));
    }

    checkDocumentsStatus();
  }, [data, file, isLoading, isLoadingStatus, statusData]);

  return (
    <Layout>
      <div className="container flex justify-center items-center mx-auto max-w-screen-xl">
        {!file || !data ? (
          <FileUploader onDropFile={onDropFile} file={fileBuffer} placeholder={t('translation.drag')} />
        ) : (
          <div>
            <div className="container flex flex-wrap">
              <button
                id="dropdownDefault"
                data-dropdown-toggle="dropdown"
                className="text-primary-500 bg-white font-medium rounded-md text-sm px-5 py-2.5 ml-4 mr-6 mb-2 focus:outline-none border border-gray-200 shadow-md text-center items-center inline-flex"
                type="button"
              >
                {t('translation.select-language')}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div
                id="dropdown"
                className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
              >
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                  <li></li>
                </ul>
              </div>

              <button
                type="button"
                className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none "
                onClick={onClickChangeDocument}
              >
                {t('translation.change-document')}
              </button>
            </div>
            <div className="container flex flex-wrap">
              {data &&
                data.links.map((link, index) => (
                  <TranslationCard key={index} label={link.language} link={link.url} status={getStatus(link)} />
                ))}
            </div>
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

export default Translation;
