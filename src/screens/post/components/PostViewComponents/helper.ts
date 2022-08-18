import appConfig from '~/configs/appConfig';
import { blacklistReactions } from '~/constants/reactions';

export const validateReactionCount = (reactionCounts: any) => {
  const count = getTotalReactions(reactionCounts, 'emoji');
  return count < appConfig.limitReactionCount;
};

export const getTotalReactions = (reactionCounts: any, type: 'emoji' | 'user') => {
  let total = 0;
  Object.values(reactionCounts || {})?.forEach((reaction: any) => {
    const key = Object.keys(reaction || {})?.[0];
    if (!!key && !!reaction?.[key] && !blacklistReactions?.[key]) {
      total += type === 'emoji' ? 1 : (reaction?.[key] || 0)
    }
  });
  return total
}
