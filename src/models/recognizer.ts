// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { DocumentEntity, DocumentField } from '@azure/ai-form-recognizer';

export type RecognizerData =
  | {
      [key: string]: DocumentField;
    }
  | DocumentEntity[];

export type RecognizerVaccine = {
  DateAdministered: DocumentField;
  HealthAgency: DocumentField;
};

export type RecognizerVaccines = RecognizerVaccine[];
