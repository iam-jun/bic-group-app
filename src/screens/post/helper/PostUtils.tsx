import { ICommentData } from '~/interfaces/IPost';

export const sortComments = (comments: ICommentData[]) => {
  let newComments: any = comments || [];
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
