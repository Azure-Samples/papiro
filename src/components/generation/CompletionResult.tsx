// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTranslation } from 'next-i18next';
import { GenerationReq, GenerationData } from '~/models';

type CompletionResultProps = {
  request: GenerationReq;
  results?: GenerationData;
};

export function CompletionResult(props: CompletionResultProps) {
  const { t } = useTranslation('common');
  const { request, results } = props;

  const renderCompletions = (prompt: string, completions: string[]) => {
    return completions.map((completion, idx) => (
      <div key={`completion_${idx}`} className="mt-3 mb-3 mr-5 border rounded p-4 bg-white text-3xl cursor-pointer">
        <span className="text-slate-400">{prompt}</span>&nbsp;
        <span className="text-primary-600">{completion.replace(prompt, '')}</span>
        <span>...</span>
      </div>
    ));
  };

  const renderDatetime = (timestamp: string) => {
    const d = new Date(Date.parse(timestamp));
    return (
      <div>
        <span>{d.toLocaleDateString()}</span>&nbsp;
        <span>{d.toLocaleTimeString()}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="overflow-y-auto appearance-none w-full h-96 text-gray-700 text-2xl pb-4">
        {results && <div>{renderCompletions(request.prompt, results.generated)}</div>}
      </div>
      {results && (
        <div className="mt-4 flex mr-5 text-sm justify-end">
          <span>Rendered in</span>&nbsp;
          <span className="text-primary-500 font-bold">{results.time}</span>&nbsp;
          <span>seconds on</span>&nbsp;
          <span className="text-primary-500 font-bold">{renderDatetime(results.timestamp)}</span>&nbsp;
          <span>(server time)</span>
        </div>
      )}
    </div>
  );
}
