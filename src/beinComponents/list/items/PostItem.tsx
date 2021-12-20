import React, {memo} from 'react';
import {IPostActivity} from '~/interfaces/IPost';
import PostView from '~/screens/Post/components/PostView';

export interface PostItemProps {
  postData: IPostActivity;
  testID?: string;
}

const PostItem = ({postData, testID}: any) => {
  return <PostView postId={postData?.id} testID={testID} />;
};

export default memo(PostItem);
