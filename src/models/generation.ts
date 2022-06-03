// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
export type GenerationReq = {
  prompt: string;
  length: number;
  count: number;
};

export type GenerationData = {
  time: number;
  generated: string[];
  timestamp: string;
  message: string;
};
