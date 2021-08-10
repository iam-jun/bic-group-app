const postKeySelector = {
  mention: {
    searchKey: 'post.mention.searchKey',
    searchResult: 'post.mention.searchResult',
  },
  postDetail: {
    id: 'post.postDetail.id',
  },
  allPosts: 'post.allPosts',
  postById: (id: string) => `post.allPosts.${id}`,
  postObjectDataById: (id: string) => `post.allPosts.${id}.object.data`,
  postActorById: (id: string) => `post.allPosts.${id}.actor`,
  postAudienceById: (id: string) => `post.allPosts.${id}.audience`,
  postTimeById: (id: string) => `post.allPosts.${id}.time`,
  postImportantById: (id: string) => `post.allPosts.${id}.important`,
  postOwnReactionById: (id: string) => `post.allPosts.${id}.own_reactions`,
  postReactionCountsById: (id: string) => `post.allPosts.${id}.reaction_counts`,
};

export default postKeySelector;
