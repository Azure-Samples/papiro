// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTranslation } from 'next-i18next';
import { TranslationStatus } from '~/models';
import { Loading } from '../layout';

type TranslationCardProps = {
  label: string;
  link: string;
  status: TranslationStatus;
};

export function TranslationCard(props: TranslationCardProps) {
  const { label, link, status } = props;
  const { t } = useTranslation('common');

  return (
    <div className="p-10 m-4 w-44 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-500 dark:text-white text-center">
        {t(`translation.languages.${label}`)}
      </h5>
      <div className="flex justify-center mt-10">
        {(status === TranslationStatus.Running || status === TranslationStatus.NotStarted) && (
          <div className="flex justify-center">
            <Loading size={2} />
          </div>
        )}

        {(status === TranslationStatus.Canceled ||
          status === TranslationStatus.Failed ||
          status === TranslationStatus.ValidationFailed) && <div>Error</div>}

        {status === TranslationStatus.Succeeded && (
          <a
            href={link}
            target="_blank"
            download
            className="inline-flex items-center py-2 px-2 text-base font-medium text-center bg-wite text-primary-500 border border-indigo-500/100 rounded-lg hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            rel="noreferrer"
          >
            {t('translation.download')}
          </a>
        )}
      </div>
    </div>
  );
}
