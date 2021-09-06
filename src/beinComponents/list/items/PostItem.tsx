import React from 'react';
import {TouchableOpacity} from 'react-native';
import {IPostActivity} from '~/interfaces/IPost';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import PostView from '~/screens/Post/components/PostView';

export interface PostItemProps {
  postData: IPostActivity;
}

const PostItem = ({postData}: any) => {
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const onPress = () => {
    dispatch(postActions.setPostDetail(postData));
    rootNavigation.navigate(homeStack.postDetail);
  };

  const onPressComment = () => {
    dispatch(postActions.setPostDetail(postData));
    rootNavigation.navigate(homeStack.postDetail, {focusComment: true});
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
