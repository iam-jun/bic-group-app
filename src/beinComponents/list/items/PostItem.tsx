import React, { memo } from 'react';
import { IPostActivity } from '~/interfaces/IPost';
import PostView from '~/screens/post/components/PostView';

export interface PostItemProps {
  postData: IPostActivity;
  testID?: string;
  btnReactTestID?: string;
  btnCommentTestID?: string;
}

const PostItem = ({
  postData,
  testID,
  btnReactTestID,
  btnCommentTestID,
}: any) => (
  <PostView
    postId={postData?.id}
    testID={testID}
    btnReactTestID={btnReactTestID}
    btnCommentTestID={btnCommentTestID}
  />
);

export default memo(PostItem);
