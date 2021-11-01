import React, {memo} from 'react';
import {IPostActivity} from '~/interfaces/IPost';
import PostView from '~/screens/Post/components/PostView';

export interface PostItemProps {
  postData: IPostActivity;
}

const PostItem = ({postData}: any) => {
  return <PostView postId={postData?.id} />;
};

export default memo(PostItem);
