import React from 'react';
import {useDispatch} from 'react-redux';
import {useRootNavigation} from '~/hooks/navigation';
import {IPostActivity} from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import PostView from '~/screens/Post/components/PostView';
import postActions from '~/screens/Post/redux/actions';

export interface PostItemProps {
  postData: IPostActivity;
}

const PostItem = ({postData}: any) => {
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const onPress = () => {
    rootNavigation.navigate(homeStack.postDetail, {post_id: postData.id});
  };

  const onPressComment = () => {
    rootNavigation.navigate(homeStack.postDetail, {focus_comment: true});
  };

  return (
    <PostView
      postId={postData?.id}
      onPressHeader={onPress}
      onPressComment={onPressComment}
    />
  );
};

export default PostItem;
