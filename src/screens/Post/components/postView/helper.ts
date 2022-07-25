import appConfig from '~/configs/appConfig';
import { blacklistReactions } from '~/constants/reactions';

export const validateReactionCount = (reactionCounts: any) => {
  let count = 0;
  Object.values(reactionCounts || {})?.forEach((reaction: any) => {
    const key = Object.keys(reaction || {})?.[0];
    if (!!key && !!reaction?.[key] && !blacklistReactions?.[key]) {
      count += 1;
    }
  });
  return count < appConfig.limitReactionCount;
};
