// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
export enum FeedbackSentiment {
  positive = 'positive',
  negative = 'negative',
  neutral = 'neutral'
}

export type FeedbackData = {
  sentiment: FeedbackSentiment;
  text: string;
};
