import React, {useEffect, useRef} from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {useCreatePost} from '~/hooks/post';
import {ITheme} from '~/theme/interfaces';
import {IAudience, IPostCreatePost} from '~/interfaces/IPost';
import {margin, padding} from '~/theme/spacing';
import postActions from '~/screens/Post/redux/actions';

import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';
import PostInput from '~/beinComponents/inputs/PostInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostToolbar from '~/beinComponents/BottomSheet/PostToolbar';
import CreatePostChosenAudiences from '../components/CreatePostChosenAudiences';

const CreatePost = () => {
  const toolbarModalizeRef = useRef();

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme();
  const {colors} = theme;

  const createPostData = useCreatePost();
  const {loading, data, tags = [], chosenAudiences = []} = createPostData || {};
  const {content, images, videos, files} = data || {};
  const actor = 9; //todo replace with BEIN userId later...

  //Enable  Post button if :
  // + Has at least 1 audience AND
  // + (text != empty OR at least 1 photo OR at least 1 file)
  const disableButtonPost =
    loading || content?.length === 0 || chosenAudiences.length === 0;

  useEffect(() => {
    dispatch(postActions.clearCreatPostData());
    return () => {
      dispatch(postActions.clearCreatPostData());
    };
  }, []);

  const onPressPost = async () => {
    const tags = [0]; //todo remove default

    const users: number[] = [];
    const groups: number[] = [];
    const audience = {groups, users};

    chosenAudiences.map((selected: IAudience) => {
      if (selected.type === 'user') {
        users.push(Number(selected.id));
      } else {
        groups.push(Number(selected.id));
      }
    });

    const payload: IPostCreatePost = {actor, data, audience, tags};
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
        <CreatePostChosenAudiences />
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

export default CreatePost;
