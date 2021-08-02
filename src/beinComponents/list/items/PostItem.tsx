import React from 'react';
import {TouchableOpacity} from 'react-native';
import PostView from '~/beinFragments/PostView';
import {IPostActivity} from '~/interfaces/IPost';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

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

  return (
    <TouchableOpacity onPress={onPress}>
      <PostView postData={postData} />
    </TouchableOpacity>
  );
};

export default PostItem;
