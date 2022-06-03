// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
export type TranslationLink = {
  language: string;
  url: string;
};

export enum TranslationStatus {
  Canceled = 'Canceled',
  Cancelling = 'Cancelling',
  Failed = 'Failed',
  NotStarted = 'NotStarted',
  Running = 'Running',
  Succeeded = 'Succeeded',
  ValidationFailed = 'ValidationFailed'
}

export type TranslationData = {
  links: TranslationLink[];
  statusUrl: string;
};

export type TranslationStatusDataItem = {
  path: string;
  to: string;
  status: TranslationStatus;
};

export type TranslationStatusData = TranslationStatusDataItem[];

export type TranslationRequest = {
  body: string;
};

export type TranslationTargetLink = {
  targetUrl: string;
  language: string;
};

export const translationLanguages = ['en', 'fr', 'de', 'pt', 'es', 'ja', 'cs', 'nl', 'it', 'pl'];
