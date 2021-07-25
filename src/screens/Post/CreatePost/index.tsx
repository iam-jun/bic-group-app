import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {margin, padding} from '~/theme/spacing';
import {useBaseHook} from '~/hooks';
import Header from '~/beinComponents/Header';
import {ITheme} from '~/theme/interfaces';
import SelectedAudienceSection from './components/SelectedAudienceSection';
import Divider from '~/beinComponents/Divider';
import PostInput from '~/beinComponents/inputs/PostInput';
import PostToolbar from '~/beinComponents/BottomSheet/PostToolbar';
import {useCreatePost} from '~/hooks/post';
import postActions from '~/screens/Post/redux/actions';
import {IPostCreatePost} from '~/interfaces/IPost';

const CreatePostView = () => {
  const toolbarModalizeRef = useRef();

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme();
  const {colors} = theme;

  const createPostData = useCreatePost();
  const {loading, data, audience, tags} = createPostData || {};
  const {content, images, videos, files} = data || {};
  const {groups, users} = audience || {};

  const disableButtonPost = loading || content?.length === 0;

  useEffect(() => {
    return () => {
      dispatch(postActions.clearCreatPostData());
    };
  }, []);

  const onPressPost = () => {
    const payload: IPostCreatePost = {data, audience, tags};
    dispatch(postActions.postCreateNewPost(payload));
  };

  const onChangeText = (text: string) => {
    dispatch(postActions.setCreatePostData({...data, content: text}));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScreenWrapper testID={'CreatePostScreen'}>
        <Header
          titleTextProps={{useI18n: true}}
          title={'post:create_post'}
          buttonText={'post:post_button'}
          buttonProps={{
            loading: loading,
            disabled: disableButtonPost,
            color: colors.primary7,
            textColor: colors.textReversed,
            useI18n: true,
          }}
          onPressButton={onPressPost}
        />
        <SelectedAudienceSection />
        <Divider />
        <PostInput
          multiline
          placeholder={t('post:placeholder_write_post')}
          onChangeText={onChangeText}
        />
        <PostToolbar modalizeRef={toolbarModalizeRef} />
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default CreatePostView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'space-between',
  },
  sendTo: {
    marginHorizontal: margin.big,
    marginVertical: margin.base,
  },
  chooseAudience: {
    marginHorizontal: margin.small,
    marginVertical: margin.base,
    borderRadius: 50,
    paddingHorizontal: padding.base,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    minHeight: 500,
    marginVertical: margin.base,
    marginHorizontal: margin.big,
  },
  button: {
    height: 35,
  },
  actionList: {
    justifyContent: 'flex-end',
    marginVertical: margin.big,
  },
  audienceList: {
    marginBottom: margin.large,
    marginHorizontal: margin.large,
  },
});
