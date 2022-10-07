import { orderBy } from 'lodash';
import { PixelRatio } from 'react-native';
import { ICommentData } from '~/interfaces/IPost';
import { dimension } from '~/theme';

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
  const contents = content.split(/\s+/);
  Object.keys(tempMentions || {}).forEach((username) => {
    if (contents?.includes?.(`@${username}`)) {
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

export const checkExpiration = (expireTime: string) => new Date().getTime() >= new Date(expireTime).getTime();
