import React, { memo } from 'react';
import { IPostActivity } from '~/interfaces/IPost';
import PostView from '~/screens/post/components/PostView';

export interface PostItemProps {
  postData: IPostActivity;
  testID?: string;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  hasReactPermission?: boolean;
}

const PostItem = ({
  postData,
  testID,
  btnReactTestID,
  btnCommentTestID,
  hasReactPermission,
}: any) => (
  <PostView
    postId={postData?.id}
    testID={testID}
    btnReactTestID={btnReactTestID}
    btnCommentTestID={btnCommentTestID}
    hasReactPermission={hasReactPermission}
  />
);

export default memo(PostItem);
