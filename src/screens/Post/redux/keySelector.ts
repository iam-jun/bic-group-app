const postKeySelector = {
  createComment: {
    loading: 'post.createComment.loading',
    content: 'post.createComment.content',
    image: 'post.createComment.image',
  },
  createPost: {
    all: 'post.createPost',
    images: 'post.createPost.images',
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

  //Post data
  postById: (id: string) => `post.allPosts.${id}`,
  postActorById: (id: string) => `post.allPosts.${id}.actor`,
  postAudienceById: (id: string) => `post.allPosts.${id}.audience`,
  postCreatedAtById: (id: string) => `post.allPosts.${id}.createdAt`,
  postContentById: (id: string) => `post.allPosts.${id}.content`,
  postMediaById: (id: string) => `post.allPosts.${id}.media`,
  postHighlightById: (id: string) => `post.allPosts.${id}.highlight`,
  postSettingById: (id: string) => `post.allPosts.${id}.setting`,
  postMentionsById: (id: string) => `post.allPosts.${id}.mentions`,
  postOwnerReactionById: (id: string) => `post.allPosts.${id}.ownerReactions`,
  postReactionCountsById: (id: string) => `post.allPosts.${id}.reactionsCount`,
  postCommentCountsById: (id: string) => `post.allPosts.${id}.commentsCount`,
  postIsDraftById: (id: string) => `post.allPosts.${id}.isDraft`,
  postReactionsOrderById: (id: string) => `post.allPosts.${id}.reactions_order`,
  postDeletedById: (id: string) => `post.allPosts.${id}.deleted`,
  postLatestReactionsComments: (id: string) =>
    `post.allPosts.${id}.comments.list`,

  //Comment data
  allCommentsByParentIds: 'post.allCommentsByParentIds',
  commentsByParentId: (id: string) => `post.allCommentsByParentIds.${id}`,
  commentById: (id?: string) => `post.allComments.${id}`,

  scrollToLatestItem: 'post.scrollToLatestItem',
  postSelectAudienceState: 'post.postSelectAudienceState',
  scrollToCommentsPosition: 'post.scrollToCommentsPosition',
  loadingGetPostDetail: 'post.loadingGetPostDetail',
};

export default postKeySelector;
