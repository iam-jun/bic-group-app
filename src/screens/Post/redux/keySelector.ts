const postKeySelector = {
  createComment: {
    loading: 'post.createComment.loading',
    content: 'post.createComment.content',
    image: 'post.createComment.image',
  },
  createPost: {
    all: 'post.createPost',
    images: 'post.createPost.images',
    video: 'post.createPost.video',
    imagesDraft: 'post.createPost.imagesDraft',
    initAudiences: 'post.createPost.initAudiences',
    chosenAudiences: 'post.createPost.chosenAudiences',
    content: 'post.createPost.data.content',
  },
  reactionBottomSheet: 'post.reactionBottomSheet',
  replyingComment: 'post.replyingComment',
  postAudienceSheet: 'post.postAudienceSheet',
  allPosts: 'post.allPosts',
  allComments: 'post.allComments',
  draftPostsData: 'post.draftPosts',
  draft: {
    posts: 'post.draftPosts.posts',
    canLoadMore: 'post.draftPosts.canLoadMore',
    loading: 'post.draftPosts.loading',
    refreshing: 'post.draftPosts.refreshing',
  },
  seenPostList: {
    dataList: 'post.seenPostList.data',
    total: 'post.seenPostList.total',
    canLoadMore: 'post.seenPostList.canLoadMore',
    loading: 'post.seenPostList.loading',
  },

  //Post data
  postById: (id: string | number) => `post.allPosts.${id}`,
  postActorById: (id: string | number) => `post.allPosts.${id}.actor`,
  postAudienceById: (id: string | number) => `post.allPosts.${id}.audience`,
  postCreatedAtById: (id: string | number) => `post.allPosts.${id}.createdAt`,
  postContentById: (id: string | number) => `post.allPosts.${id}.content`,
  postMediaById: (id: string | number) => `post.allPosts.${id}.media`,
  postHighlightById: (id: string | number) => `post.allPosts.${id}.highlight`,
  postSettingById: (id: string | number) => `post.allPosts.${id}.setting`,
  postMentionsById: (id: string | number) => `post.allPosts.${id}.mentions`,
  postOwnerReactionById: (id: string | number) =>
    `post.allPosts.${id}.ownerReactions`,
  postReactionCountsById: (id: string | number) =>
    `post.allPosts.${id}.reactionsCount`,
  postCommentsCountById: (id: string | number) =>
    `post.allPosts.${id}.commentsCount`,
  postCommentOnlyCountById: (id: number) =>
    `post.allPosts.${id}.comments.meta.hasNextPage`,
  postCommentListById: (id: string | number) =>
    `post.allPosts.${id}.comments.list`,
  postIsDraftById: (id: string | number) => `post.allPosts.${id}.isDraft`,
  postReactionsOrderById: (id: string | number) =>
    `post.allPosts.${id}.reactions_order`,
  postDeletedById: (id: string | number) => `post.allPosts.${id}.deleted`,
  postMarkedReadById: (id: string | number) =>
    `post.allPosts.${id}.markedReadPost`,
  postMarkedReadSuccessById: (id: string | number) =>
    `post.allPosts.${id}.markedReadSuccess`,
  postTotalUsersSeenById: (id: string | number) =>
    `post.allPosts.${id}.totalUsersSeen`,

  //Comment data
  allCommentsByParentIds: 'post.allCommentsByParentIds',
  commentsByParentId: (id: string | number) =>
    `post.allCommentsByParentIds.${id}`,
  commentById: (id?: string | number) => `post.allComments.${id}`,

  scrollToLatestItem: 'post.scrollToLatestItem',
  postSelectAudienceState: 'post.postSelectAudienceState',
  scrollToCommentsPosition: 'post.scrollToCommentsPosition',
  loadingGetPostDetail: 'post.loadingGetPostDetail',
  commentErrorCode: 'post.commentErrorCode',
};

export default postKeySelector;
