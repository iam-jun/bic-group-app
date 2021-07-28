import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {usePostDetail} from '~/hooks/post';
import {IPostActivity} from '~/interfaces/IPost';
import PostView from '~/beinFragments/PostView';

const PostDetail = () => {
  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  const postDetail: IPostActivity = usePostDetail() || {};

  return (
    <ScreenWrapper backgroundColor={theme.colors.placeholder}>
      <Header subTitle={'Post detail'} />
      <PostView postData={postDetail} />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default PostDetail;
