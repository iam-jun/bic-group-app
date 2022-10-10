import React, { memo } from 'react';
import { IPostActivity } from '~/interfaces/IPost';
import PostView from '~/screens/post/components/PostView';

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
  testID,
  btnReactTestID,
  btnCommentTestID,
  hasReactPermission,
}: any) => (
  <PostView
    postId={postId || postData?.id}
    testID={testID}
    btnReactTestID={btnReactTestID}
    btnCommentTestID={btnCommentTestID}
    hasReactPermission={hasReactPermission}
  />
);

export default memo(PostItem);
