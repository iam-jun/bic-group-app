import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';

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
import FlashMessage from '~/beinComponents/FlashMessage';
import {useUserIdAuth} from '~/hooks/auth';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import {mentionRegex} from '~/constants/commonRegex';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

const CreatePost = () => {
  const toolbarModalizeRef = useRef();

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  const createPostData = useCreatePost();
  const {
    loading,
    data,
    tags = [],
    chosenAudiences = [],
    important,
  } = createPostData || {};
  const {content, images, videos, files} = data || {};
  const actor = useUserIdAuth();

  const mentionKey = useKeySelector(postKeySelector.mention.searchKey);
  const mentionResult = useKeySelector(postKeySelector.mention.searchResult);

  //Enable  Post button if :
  // + Has at least 1 audience AND
  // + (text != empty OR at least 1 photo OR at least 1 file)
  const disableButtonPost =
    loading || content?.length === 0 || chosenAudiences.length === 0;

  useEffect(() => {
    dispatch(postActions.clearCreatPostData());
    dispatch(postActions.setSearchResultAudienceGroups([]));
    dispatch(postActions.setSearchResultAudienceUsers([]));
    dispatch(postActions.setMentionSearchResult([]));
    dispatch(postActions.setMentionSearchKey(''));
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
    if (important?.active) {
      payload.important = important;
    }
    console.log(
      '\x1b[36m',
      '🐣 important | onPressPost : ',
      JSON.stringify(important, undefined, 2),
      '\x1b[0m',
    );
    console.log(
      '\x1b[36m',
      '🐣 payload | onPressPost : ',
      JSON.stringify(payload, undefined, 2),
      '\x1b[0m',
    );
    dispatch(postActions.postCreateNewPost(payload));
  };

  const getMention = debounce((str: string) => {
    const matches = str.match(mentionRegex);
    if (str && matches && matches.length > 0) {
      const mentionKey = matches[matches.length - 1]?.replace('@', '');
      dispatch(postActions.setMentionSearchKey(mentionKey));
      dispatch(postActions.getSearchMentionAudiences({key: mentionKey}));
    } else if (mentionKey) {
      dispatch(postActions.setMentionSearchResult([]));
      dispatch(postActions.setMentionSearchKey(''));
    }
  }, 300);

  const onChangeText = (text: string) => {
    dispatch(postActions.setCreatePostData({...data, content: text}));
    getMention(text);
  };

  const onPressMentionAudience = (audience: any) => {
    const mention = `@[u:${audience.id}:${
      audience.fullname || audience.name
    }] `;
    const newContent = content.replace(`@${mentionKey}`, mention);
    dispatch(postActions.setCreatePostData({...data, content: newContent}));
    dispatch(postActions.setMentionSearchResult([]));
    dispatch(postActions.setMentionSearchKey(''));
  };

  return (
    <View style={styles.container}>
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
        {important?.active && (
          <FlashMessage
            textProps={{variant: 'h6'}}
            leftIcon={'InfoCircle'}
            type={'important'}>
            {t('common:text_important')}
          </FlashMessage>
        )}
        <CreatePostChosenAudiences />
        <Divider />
        <MentionInput
          style={styles.flex1}
          data={mentionResult}
          modalPosition={'top'}
          modalStyle={styles.mentionInputModal}
          isMentionModalVisible={!!content && mentionResult?.length > 0}
          onPress={onPressMentionAudience}
          renderInput={() => (
            <PostInput
              multiline
              placeholder={t('post:placeholder_write_post')}
              onChangeText={onChangeText}
              value={content}
            />
          )}
        />
        <PostToolbar modalizeRef={toolbarModalizeRef} />
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
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
  mentionInputModal: {
    position: 'absolute',
    top: undefined,
    bottom: 0,
  },
});

export default CreatePost;
