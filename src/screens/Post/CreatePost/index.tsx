import React, {FC, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';

import {useBaseHook} from '~/hooks';
import {useCreatePost} from '~/hooks/post';
import {ITheme} from '~/theme/interfaces';
import {IAudience, IPostActivity, IPostCreatePost} from '~/interfaces/IPost';
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
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

export interface CreatePostProps {
  route?: {
    params?: {
      postId?: string;
      pushDetail?: boolean;
    };
  };
}

const CreatePost: FC<CreatePostProps> = ({route}: CreatePostProps) => {
  const toolbarModalizeRef = useRef();
  const {postId, pushDetail = true} = route?.params || {};

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  let initPostData: IPostActivity = {};
  if (postId) {
    initPostData = useKeySelector(postKeySelector.postById(postId));
  }

  const createPostData = useCreatePost();
  const {
    loading,
    isOpenModal,
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

  useEffect(() => {
    if (initPostData?.id) {
      const initData = initPostData?.object?.data || {};
      dispatch(postActions.setCreatePostData(initData));

      const initChosenAudience: any = [];
      initPostData?.audience?.groups?.map?.(group => {
        initChosenAudience.push({
          id: group?.id,
          type: 'group',
          name: group?.data?.name,
          avatar: group?.data?.avatarUrl,
        });
      });
      initPostData?.audience?.users?.map?.(user => {
        initChosenAudience.push({
          id: user?.id,
          type: 'user',
          name: user?.data?.fullname,
          avatar: user?.data?.avatarUrl,
        });
      });
      dispatch(postActions.setCreatePostChosenAudiences(initChosenAudience));

      const initImportant = initPostData?.important || {};
      dispatch(postActions.setCreatePostImportant(initImportant));
    }
  }, [initPostData?.id]);

  const onPressPost = async () => {
    const tags: any = []; //todo remove default

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

    //Check for update or create new post
    if (initPostData?.id) {
      console.log(`\x1b[36m🐣️ index onPressPost ${initPostData.id}\x1b[0m`);
      // const payload: IPostCreatePost = {actor, data, audience, tags};
      // if (important?.active) {
      //   payload.important = important;
      // }
      // dispatch(postActions.postCreateNewPost(payload));
    } else {
      const payload: IPostCreatePost = {actor, data, audience, tags};
      if (important?.active) {
        payload.important = important;
      }
      dispatch(postActions.postCreateNewPost(payload));
    }
  };

  const onChangeText = (text: string) => {
    dispatch(postActions.setCreatePostData({...data, content: text}));
  };

  const onMentionText = debounce((textMention: string) => {
    if (textMention) {
      dispatch(postActions.setMentionSearchKey(textMention));
      dispatch(postActions.getSearchMentionAudiences({key: textMention}));
    } else if (mentionKey || mentionResult?.length > 0) {
      dispatch(postActions.setMentionSearchResult([]));
      dispatch(postActions.setMentionSearchKey(''));
    }
  }, 300);

  const onPressMentionAudience = (audience: any) => {
    const mention = `@[u:${audience.id}:${
      audience.fullname || audience.name
    }] `;
    const newContent = content.replace(`@${mentionKey}`, mention);
    dispatch(postActions.setCreatePostData({...data, content: newContent}));

    const newChosenAudience = [...chosenAudiences];
    const mentionUser = {
      id: audience.id,
      name: audience.name || audience.fullname,
      avatar: audience.avatar,
      type: 'user',
    };
    let isDuplicate = false;
    newChosenAudience.map(item => {
      if (item?.id === mentionUser?.id && item?.type === mentionUser?.type) {
        isDuplicate = true;
      }
    });
    if (!isDuplicate) {
      newChosenAudience.unshift(mentionUser);
      dispatch(postActions.setCreatePostChosenAudiences(newChosenAudience));
    }

    dispatch(postActions.setMentionSearchResult([]));
    dispatch(postActions.setMentionSearchKey(''));
  };

  const onOpenPostToolbarModal = () => {
    dispatch(postActions.setOpenPostToolBarModal(true));
  };
  const onClosePostToolbarModal = () => {
    dispatch(postActions.setOpenPostToolBarModal(false));
  };

  return (
    <View style={styles.container}>
      <ScreenWrapper isFullView testID={'CreatePostScreen'}>
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
          data={mentionResult}
          style={styles.flex1}
          textInputStyle={styles.flex1}
          modalStyle={styles.mentionInputModal}
          modalPosition={'top'}
          isMentionModalVisible={!!content && mentionResult?.length > 0}
          onPress={onPressMentionAudience}
          onChangeText={onChangeText}
          onMentionText={onMentionText}
          value={content}
          ComponentInput={PostInput}
        />
        <PostToolbar
          isOpenModal={isOpenModal}
          onOpenModal={onOpenPostToolbarModal}
          onCloseModal={onClosePostToolbarModal}
          modalizeRef={toolbarModalizeRef}
        />
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
    position: undefined,
    top: undefined,
    bottom: undefined,
    marginTop: -12,
    maxHeight: 180,
  },
});

export default CreatePost;
