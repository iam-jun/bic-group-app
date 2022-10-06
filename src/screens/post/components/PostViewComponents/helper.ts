import appConfig from '~/configs/appConfig';
import { blacklistReactions } from '~/constants/reactions';
import { IPostAudience } from '~/interfaces/IPost';

export const validateReactionCount = (reactionCounts: any) => {
  const count = getTotalReactions(reactionCounts, 'emoji');
  return count < appConfig.limitReactionCount;
};

export const getTotalReactions = (reactionCounts: any, type: 'emoji' | 'user') => {
  let total = 0;
  Object.values(reactionCounts || {})?.forEach((reaction: any) => {
    const key = Object.keys(reaction || {})?.[0];
    if (!!key && !!reaction?.[key] && !blacklistReactions?.[key]) {
      total += type === 'emoji' ? 1 : (reaction?.[key] || 0);
    }
  });
  return total;
};

export const getAudiencesText = (
  audience?: IPostAudience, t?: any,
) => {
  if (!audience) return '';

  const limitLength = 25;
  const { groups = [], users = [] } = audience;
  const totalAudiences = groups.length + users.length;
  const firstAudienceName = groups?.[0]?.name || users?.[0]?.fullname;
  const remainingAudiences = totalAudiences - 1;

  let audiencesText = firstAudienceName || '';

  if (audiencesText?.length > limitLength) {
    audiencesText = `${audiencesText.substring(0, limitLength)}...`;
  } else if (remainingAudiences > 0) {
    audiencesText = `${audiencesText},...`;
  }
  if (remainingAudiences > 0) {
    audiencesText = `${audiencesText} +${remainingAudiences} ${t?.('post:other_places')}`;
  }
  return audiencesText;
};
