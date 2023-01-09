import IPostsState from './Interface';

const postsSelector = {
  getPost: (id: string, defaultValue?: any) => (state: IPostsState) => state?.posts?.[id] || defaultValue,
  getActor: (id) => (state: IPostsState) => state?.posts?.[id]?.actor,
  getAudience: (id: string) => (state: IPostsState) => state?.posts?.[id]?.audience,
  getCreatedAt: (id: string) => (state: IPostsState) => state?.posts?.[id]?.createdAt,
  getContent: (id: string) => (state: IPostsState) => state?.posts?.[id]?.content,
  getMedia: (id: string) => (state: IPostsState) => state?.posts?.[id]?.media,
  getHighlight: (id: string) => (state: IPostsState) => state?.posts?.[id]?.highlight,
  getSetting: (id: string) => (state: IPostsState) => state?.posts?.[id]?.setting,
  getMentions: (id: string) => (state: IPostsState) => state?.posts?.[id]?.mentions,
  getOwnerReaction: (id: string) => (state: IPostsState) => state?.posts?.[id]?.ownerReactions,
  getReactionCounts: (id: string) => (state: IPostsState) => state?.posts?.[id]?.reactionsCount,
  getCommentsCount: (id: string) => (state: IPostsState) => state?.posts?.[id]?.commentsCount,
  getCommentOnlyCount: (id: string) => (state: IPostsState) => state?.posts?.[id]?.comments?.meta?.hasNextPage,
  getCommentList: (id: string) => (state: IPostsState) => state?.posts?.[id]?.comments?.list,
  getStatus: (id: string) => (state: IPostsState) => state?.posts?.[id]?.status,
  getDeleted: (id: string) => (state: IPostsState) => state?.posts?.[id]?.deleted,
  getMarkedRead: (id: string) => (state: IPostsState) => state?.posts?.[id]?.markedReadPost,
  getMarkedReadSuccess: (id: string) => (state: IPostsState) => state?.posts?.[id]?.markedReadSuccess,
  getTotalUsersSeen: (id: string) => (state: IPostsState) => state?.posts?.[id]?.totalUsersSeen,
  getLinkPreview: (id: string) => (state: IPostsState) => state?.posts?.[id]?.linkPreview,
  getReported: (id: string) => (state: IPostsState) => state?.posts?.[id]?.reported,
  getType: (id: string) => (state: IPostsState) => state?.posts?.[id]?.type,
};

export default postsSelector;
