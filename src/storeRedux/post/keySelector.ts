const postKeySelector = {
  createPost: {
    all: 'post.createPost',
    images: 'post.createPost.images',
    video: 'post.createPost.video',
    files: 'post.createPost.files',
    imagesDraft: 'post.createPost.imagesDraft',
    initAudiences: 'post.createPost.initAudiences',
    chosenAudiences: 'post.createPost.chosenAudiences',
    content: 'post.createPost.data.content',
  },
  reactionBottomSheet: 'post.reactionBottomSheet',
  replyingComment: 'post.replyingComment',
  postAudienceSheet: 'post.postAudienceSheet',

  scrollToLatestItem: 'post.scrollToLatestItem',
  postSelectAudienceState: 'post.postSelectAudienceState',
  scrollToCommentsPosition: 'post.scrollToCommentsPosition',
  loadingGetPostDetail: 'post.loadingGetPostDetail',
  commentErrorCode: 'post.commentErrorCode',
};

export default postKeySelector;
