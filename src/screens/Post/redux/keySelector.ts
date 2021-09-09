const postKeySelector = {
  createComment: {
    loading: 'post.createComment.loading',
    content: 'post.createComment.content',
  },
  reactionBottomSheet: 'post.reactionBottomSheet',
  replyingComment: 'post.replyingComment',
  postAudienceSheet: 'post.postAudienceSheet',
  allPosts: 'post.allPosts',
  allComments: 'post.allComments',
  postById: (id: string) => `post.allPosts.${id}`,
  postObjectDataById: (id: string) => `post.allPosts.${id}.object.data`,
  postActorById: (id: string) => `post.allPosts.${id}.actor`,
  postAudienceById: (id: string) => `post.allPosts.${id}.audience`,
  postTimeById: (id: string) => `post.allPosts.${id}.time`,
  postImportantById: (id: string) => `post.allPosts.${id}.important`,
  postOwnReactionById: (id: string) => `post.allPosts.${id}.own_reactions`,
  postReactionCountsById: (id: string) => `post.allPosts.${id}.reaction_counts`,
  postDeletedById: (id: string) => `post.allPosts.${id}.deleted`,
  postLatestReactionsComments: (id: string) =>
    `post.allPosts.${id}.latest_reactions.comment`,
  postCommentCountsById: (id: string) =>
    `post.allPosts.${id}.reaction_counts.comment`,
  allCommentsByParentIds: 'post.allCommentsByParentIds',
  commentsByParentId: (id: string) => `post.allCommentsByParentIds.${id}`,
  commentById: (id?: string) => `post.allComments.${id}`,
};

export default postKeySelector;
