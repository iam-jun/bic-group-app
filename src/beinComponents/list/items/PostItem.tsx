import React, { memo } from 'react';
import { IPostActivity } from '~/interfaces/IPost';
import ArticleItem from '~/screens/articles/components/ArticleItem';
import PostView from '~/screens/post/components/PostView';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

export interface PostItemProps {
  postId?: string;
  postData?: IPostActivity;
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

  if (_postData?.isArticle) {
    return <ArticleItem id={postId} />;
  }

  return (
    <PostView
      postId={postId || postData?.id}
      {...props}
    />
  );
};

export default memo(PostItem);
