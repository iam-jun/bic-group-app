const CRUDlist = {
  newsfeed: 'newsfeed',
  comments: 'comments',
  replies: 'replies',
  postLikes: 'postLikes',
  myPosts: 'myPosts',
  myDrafts: 'myDrafts',
  messages: 'messages',
};

export type IListType = keyof typeof CRUDlist;
export default CRUDlist;
