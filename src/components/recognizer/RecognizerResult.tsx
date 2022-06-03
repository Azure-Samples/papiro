// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { DocumentEntity, DocumentField } from '@azure/ai-form-recognizer';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { RecognizerData } from '~/models';

type RecognizerResultProps = {
  picture: string | null | undefined;
  title: string;
  results: RecognizerData | undefined;
};

// Value is not in DocumentField yet
type DocumentFieldWithValue = any;

export function RecognizerResult(props: RecognizerResultProps) {
  const { picture, title, results } = props;
  const { t } = useTranslation('common');

  const getValueFromEntity = (entity: DocumentField) => {
    if (entity.kind === 'date' && entity.value) {
      return format(new Date(entity.value), 'MM/dd/yyyy');
    }

    return (entity as DocumentFieldWithValue).value || entity.content;
  };

  const renderEntity = (label: string, value: string, translate = (text: string) => text) => {
    return (
      <div className="flex flex-col w-48 xl:w-72 pb-4">
        <span className="text-md text-gray-500 font-medium">{translate(label)}</span>
        <span className="text-md text-gray-500 bg-white border border-gray-200 rounded-lg p-2 mt-1 mr-4 xl:mr-10 shadow-sm">
          {value}
        </span>
      </div>
    );
  };

  const renderResults = (results: RecognizerData) => {
    const hasNoEntities = Array.isArray(results);

    if (hasNoEntities) {
      return results.map((entity: DocumentEntity) => renderEntity(entity.category, entity.content));
    }

    return Object.entries(results).map(([key, entity]: [string, DocumentField]) =>
      renderEntity(key, getValueFromEntity(entity), (text) => t(`recognizer.form.${text}`))
    );
  };

  return (
    <div className="flex w-full my-6">
      <div className="w-1/4">
        {picture && (
          <Image
            className={`object-cover object-center rounded-md border border-gray-200 w-14 h-14 `}
            src={picture}
            alt={title}
            width={260}
            height={190}
          />
        )}
      </div>
      <div className="w-3/4 px-4">
        <h3 className="text-xl text-gray-500 font-semibold pb-4">{title}</h3>
        <div className="flex flex-wrap">{results && renderResults(results)}</div>
      </div>
    </div>
  );
}
