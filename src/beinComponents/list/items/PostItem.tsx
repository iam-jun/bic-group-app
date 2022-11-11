import React, { memo } from 'react';
import { IPost, POST_TYPE } from '~/interfaces/IPost';
import ArticleItem from '~/screens/articles/components/ArticleItem';
import PostView from '~/screens/post/components/PostView';
import { SeriesItem } from '~/screens/series';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

export interface PostItemProps {
  postId?: string;
  postData?: IPost;
  testID?: string;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  hasReactPermission?: boolean;
}

const PostItem = ({
  postId,
  postData,
  ...props
}: any) => {
  let _postData = postData;
  if (!_postData) _postData = usePostsStore(postsSelector.getPost(postId));

  if (_postData?.type === POST_TYPE.ARTICLE) {
    return <ArticleItem id={postId} />;
  }

  if (_postData?.type === POST_TYPE.SERIES) {
    return <SeriesItem id={postId} />;
  }

  return (
    <PostView
      postId={postId || postData?.id}
      {...props}
    />
  );
};

export default memo(PostItem);
