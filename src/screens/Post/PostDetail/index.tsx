import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import {usePostDetail} from '~/hooks/post';
import {IPostActivity} from '~/interfaces/IPost';
import PostView from '~/beinFragments/PostView';
import CommentInput from '~/beinComponents/inputs/CommentInput';
import ListView from '~/beinComponents/list/ListView';

const PostDetail = () => {
  const [commentText, setCommentText] = useState('');

  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  const postDetail: IPostActivity = usePostDetail() || {};

  useEffect(() => {
    console.log('\x1b[36m', '🐣️ get comment |  : ', '\x1b[0m');
  }, []);

  const renderPostContent = () => {
    return <PostView postData={postDetail} />;
  };

  const onTextChange = (text: string) => {
    setCommentText(text);
  };

  const onPressSend = () => {
    alert('send: ' + commentText);
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.placeholder}>
      <Header subTitle={'Post detail'} />
      <ListView isFullView ListHeaderComponent={renderPostContent} />
      <CommentInput onChangeText={onTextChange} onPressSend={onPressSend} />
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
