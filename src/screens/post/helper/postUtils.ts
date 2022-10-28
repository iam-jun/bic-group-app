import { orderBy } from 'lodash';
import { PixelRatio } from 'react-native';
import { ICommentData } from '~/interfaces/IPost';
import { dimension } from '~/theme';

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

export const checkExpiration = (expireTime: string) => new Date().getTime() >= new Date(expireTime).getTime();

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
