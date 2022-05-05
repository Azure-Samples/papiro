export enum FeedbackSentiment {
  positive = 'positive',
  negative = 'negative',
  neutral = 'neutral'
}

export type FeedbackData = {
  sentiment: FeedbackSentiment;
  text: string;
};
