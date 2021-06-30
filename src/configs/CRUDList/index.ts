const list = {
  newsfeed: 'newsfeed',
  comments: 'comments',
  replies: 'replies',
  postLikes: 'postLikes',
  myPosts: 'myPosts',
  myDrafts: 'myDrafts',
  messages: 'messages',
};

export type IListType = keyof typeof list;
export default list;
