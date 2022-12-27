import { orderBy, isEmpty } from 'lodash';
import { PixelRatio } from 'react-native';
import {
  ICommentData, IPost, IPostAudience, IPostCommunities,
} from '~/interfaces/IPost';
import { dimension } from '~/theme';
import appConfig from '~/configs/appConfig';
import { blacklistReactions } from '~/constants/reactions';

export const defaultList = [{ title: '', type: 'empty', data: [] }];

export const sortComments = (comments: ICommentData[]) => {
  let newComments: any[] = comments || [];
  comments?.forEach?.((cmt: ICommentData) => {
    if (cmt?.child) {
      cmt.child.list = cmt.child?.list
        ?.sort?.((
          c1: ICommentData, c2: ICommentData,
        ) => (c1?.createdAt
           && c2?.createdAt && c1?.createdAt > c2?.createdAt
          ? 1
          : -1));
    }
  });
  newComments = newComments
    ?.sort?.((
      c1: ICommentData, c2: ICommentData,
    ) => (c1?.createdAt && c2?.createdAt
       && c1?.createdAt > c2?.createdAt ? 1 : -1));
  return newComments;
};

export const getMentionsFromContent = (
  content?: string,
  tempMentions?: any,
) => {
  if (!content || !tempMentions) {
    return {};
  }
  const mentions: any = {};
  Object.keys(tempMentions || {}).forEach((username) => {
    if (content?.includes?.(`@${username}`)) {
      mentions[username] = tempMentions[username]?.data || tempMentions[username];
    }
  });
  return mentions;
};

export const getThumbnailImageLink = (thumbnails: any[]): string => {
  const deviceWidthPixel = PixelRatio.get() * dimension.deviceWidth;
  if (thumbnails?.length > 0) {
    const newThumbnails = orderBy(
      thumbnails, ['width'], ['asc'],
    );
    for (let index = 0; index < thumbnails.length; index++) {
      if (newThumbnails[index]?.width >= deviceWidthPixel) {
        return newThumbnails[index]?.url;
      }
    }
    return newThumbnails[thumbnails.length - 1]?.url;
  }
  return '';
};

export const isPostExpired = (expireTime: string) => new Date().getTime() >= new Date(expireTime).getTime();

export const getSectionData = (listComment: ICommentData[]) => {
  const result: any[] = [];
  listComment?.forEach?.((comment, index) => {
    const item: any = {};
    const lastChildComment = comment?.child?.list || [];
    const _data
      = lastChildComment.length > 0
        ? [lastChildComment[lastChildComment.length - 1]]
        : [];
    item.comment = comment;
    item.index = index;
    item.data = _data;
    result.push(item);
  });
  // long post without comment cant scroll to bottom
  // so need default list with an empty item to trigger scroll
  return result?.length > 0 ? result : defaultList;
};

export const validateReactionCount = (reactionsCount: any) => {
  const count = getTotalReactions(reactionsCount, 'emoji');
  return count < appConfig.limitReactionCount;
};

export const getTotalReactions = (reactionsCount: any, type: 'emoji' | 'user') => {
  let total = 0;
  Object.values(reactionsCount || {})?.forEach((reaction: any) => {
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

export const getCommunitiesText = (communities?: IPostCommunities[], t?: any) => {
  if (!communities || communities?.length === 0) return '';

  const limitLength = 25;
  const totalCommunities = communities?.length;
  const firstCommunitiesName = communities?.[0]?.name;
  const remainingCommunities = totalCommunities - 1;

  let communitiesText = firstCommunitiesName || '';

  if (communitiesText?.length > limitLength) {
    communitiesText = `${communitiesText.substring(0, limitLength)}...`;
  } else if (remainingCommunities > 0) {
    communitiesText = `${communitiesText},...`;
  }
  if (remainingCommunities > 0) {
    communitiesText = `${communitiesText} +${remainingCommunities} ${t?.('post:other_places')}`;
  }

  return communitiesText;
};

export const isEmptyPost = (post: IPost) => {
  const { images, videos, files } = post?.media || {};

  return !post?.content
    && isEmpty(images)
    && isEmpty(videos)
    && isEmpty(files);
};

export const getPostMenus = (data: any[], isActor: boolean, reactionsCount: any) => {
  const result = [];
  data.forEach((item: any) => {
    const requireNothing = !item.requireIsActor && !item?.requireReactionCounts;
    const requireActor = item.requireIsActor && isActor;
    const hasReaction = reactionsCount && Object.keys(reactionsCount)?.[0];
    const requireReactionCounts = item?.requireReactionCounts && reactionsCount && hasReaction;
    const notShowForActor = item?.notShowForActor;

    if (item.shouldBeHidden) return;

    if ((requireNothing || requireActor || requireReactionCounts) && !notShowForActor) {
      result.push({ ...item });
    }
  });

  return result;
};

export const getRootGroupids = (audience: IPostAudience) => {
  const result = [];
  audience?.groups?.forEach((item) => {
    if (!result?.includes(item?.rootGroupId)) {
      result.push(item?.rootGroupId);
    }
  });
  return result;
};
