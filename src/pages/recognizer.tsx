// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Layout, RecognizerResult, RecognizerUploader } from '~/components';
import { RecognizerData } from '~/models';

const Recognizer: NextPage = () => {
  const { t } = useTranslation('common');
  const webcamRef = useRef<Webcam>(null);
  const [vaccineImage, setVaccineImage] = useState<string | null>();
  const [badgeImage, setBadgeImage] = useState<string | null>();
  const [vaccineData, setVaccineData] = useState<RecognizerData>();
  const [badgeData, setBadgeData] = useState<RecognizerData>();

  const onLoadVaccine = useCallback((image, data) => {
    setVaccineImage(image);
    setVaccineData(data);
  }, []);

  const onLoadBadge = useCallback((image, data) => {
    setBadgeImage(image);
    setBadgeData(data);
  }, []);

  return (
    <Layout>
      {!badgeData ? (
        <div className="container flex justify-center  mx-auto max-w-screen-xl items-stretch">
          <div className="w-1/2 px-2">
            <div className="rounded-md w-full max-w-2xl bg-gray-200 min-h-full">
              <Webcam
                className="rounded-md w-full max-w-2xl bg-gray-200"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
            </div>
          </div>
          <div className="w-1/2 lg:ml-6 p-6 flex flex-col justify-start">
            <h2 className="text-xl lg:text-2xl xl:text-4xl font-bold text-gray-500 ">{t('recognizer.title')}</h2>

            <ul className="mt-6 lg:mt-14">
              <RecognizerUploader
                model="prebuilt-vaccinationCard"
                webcamRef={webcamRef}
                placeholderUrl="/images/placeholder-vaccine.svg"
                onLoad={onLoadVaccine}
                title={t('recognizer.pictures.vaccine')}
              />

              <RecognizerUploader
                webcamRef={webcamRef}
                placeholderUrl="/images/placeholder-badge.svg"
                onLoad={onLoadBadge}
                enableCapture={!!vaccineData}
                title={t('recognizer.pictures.badge')}
              />
            </ul>
          </div>
        </div>
      ) : (
        <div className="container flex flex-col justify-center mx-auto max-w-screen-4xl">
          <RecognizerResult picture={vaccineImage} title={t('recognizer.results.vaccine')} results={vaccineData} />
          <RecognizerResult picture={badgeImage} title={t('recognizer.results.badge')} results={badgeData} />
        </div>
      )}
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

export default Recognizer;
