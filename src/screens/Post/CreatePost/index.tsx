import React, {FC, useEffect, useRef} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {debounce} from 'lodash';

import {useBaseHook} from '~/hooks';
import {useCreatePost} from '~/hooks/post';
import {ITheme} from '~/theme/interfaces';
import {
  IAudience,
  ICreatePostParams,
  IPayloadPutEditPost,
  IPostActivity,
  IPostCreatePost,
} from '~/interfaces/IPost';
import {margin, padding} from '~/theme/spacing';
import postActions from '~/screens/Post/redux/actions';

import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';
import PostInput from '~/beinComponents/inputs/PostInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostToolbar from '~/beinComponents/BottomSheet/PostToolbar';
import CreatePostChosenAudiences from '../components/CreatePostChosenAudiences';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import * as modalActions from '~/store/modal/actions';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const CreatePost: FC<CreatePostProps> = ({route}: CreatePostProps) => {
  const toolbarModalizeRef = useRef();
  const {postId, replaceWithDetail, initAudience} = route?.params || {};

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
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
    chosenAudiences = [],
    important,
  } = createPostData || {};
  const {content, images, videos, files} = data || {};

  const isEditPost = !!initPostData?.id;
  const isEditPostHasChange = content !== initPostData?.object?.data?.content;

  const groupIds: any[] = [];
  chosenAudiences.map((selected: IAudience) => {
    if (selected.type !== 'user') {
      groupIds.push(selected.id);
    }
  });
  const strGroupIds = groupIds.join(',');

  //Enable  Post button if :
  // + Has at least 1 audience AND
  // + (text != empty OR at least 1 photo OR at least 1 file)
  const disableButtonPost =
    loading ||
    content?.length === 0 ||
    chosenAudiences.length === 0 ||
    (isEditPost && !isEditPostHasChange);

  useEffect(() => {
    dispatch(postActions.clearCreatPostData());
    dispatch(postActions.setSearchResultAudienceGroups([]));
    dispatch(postActions.setSearchResultAudienceUsers([]));
    if (initAudience?.id) {
      dispatch(
        postActions.setCreatePostChosenAudiences(new Array(initAudience)),
      );
    }
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
          avatar: group?.data?.avatar,
        });
      });
      initPostData?.audience?.users?.map?.(user => {
        initChosenAudience.push({
          id: user?.id,
          type: 'user',
          name: user?.data?.fullname,
          avatar: user?.data?.avatar,
        });
      });
      dispatch(postActions.setCreatePostChosenAudiences(initChosenAudience));

      const initImportant = initPostData?.important || {};
      dispatch(postActions.setCreatePostImportant(initImportant));
    }
  }, [initPostData?.id]);

  const onPressBack = () => {
    Keyboard.dismiss();
    if (isEditPost) {
      if (isEditPostHasChange) {
        dispatch(
          modalActions.showAlert({
            title: t('post:alert_title_back_edit_post'),
            content: t('post:alert_content_back_edit_post'),
            cancelBtn: true,
            confirmLabel: t('common:btn_discard'),
            onConfirm: () => rootNavigation.goBack(),
          }),
        );
        return;
      }
    } else {
      if (content) {
        dispatch(
          modalActions.showAlert({
            title: t('post:alert_title_back_create_post'),
            content: t('post:alert_content_back_create_post'),
            cancelBtn: true,
            confirmLabel: t('common:btn_discard'),
            onConfirm: () => rootNavigation.goBack(),
          }),
        );
        return;
      }
    }
    rootNavigation.goBack();
  };

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

    if (isEditPost && initPostData?.id) {
      const newEditData: IPostCreatePost = {
        getstream_id: initPostData.id,
        data,
        audience,
        tags,
      };
      if (important?.active) {
        newEditData.important = important;
      }
      const payload: IPayloadPutEditPost = {
        id: initPostData?.id,
        replaceWithDetail: replaceWithDetail,
        data: newEditData,
      };
      dispatch(postActions.putEditPost(payload));
    } else {
      const payload: IPostCreatePost = {data, audience, tags};
      if (important?.active) {
        payload.important = important;
      }
      dispatch(postActions.postCreateNewPost(payload));
    }
    Keyboard.dismiss();
  };

  const onChangeText = (text: string) => {
    dispatch(postActions.setCreatePostData({...data, content: text}));
  };

  const onPressMentionAudience = (audience: any) => {
    //TEMP DISABLE AUTO ADD USER SELECTED TO AUDIENCE
    // const newChosenAudience = [...chosenAudiences];
    // const mentionUser = {
    //   id: audience.id,
    //   name: audience.name || audience.fullname,
    //   avatar: audience.avatar,
    //   type: 'user',
    // };
    // let isDuplicate = false;
    // newChosenAudience.map(item => {
    //   if (item?.id === mentionUser?.id && item?.type === mentionUser?.type) {
    //     isDuplicate = true;
    //   }
    // });
    // if (!isDuplicate) {
    //   newChosenAudience.unshift(mentionUser);
    //   dispatch(postActions.setCreatePostChosenAudiences(newChosenAudience));
    // }
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
          title={isEditPost ? 'post:title_edit_post' : 'post:create_post'}
          buttonText={isEditPost ? 'common:btn_save' : 'post:post_button'}
          buttonProps={{
            loading: loading,
            disabled: disableButtonPost,
            color: colors.primary7,
            textColor: colors.textReversed,
            useI18n: true,
          }}
          onPressBack={onPressBack}
          onPressButton={onPressPost}
        />
        {!isEditPost && (
          <View>
            {!!important?.active && <ImportantStatus notExpired />}
            <CreatePostChosenAudiences />
            <Divider />
          </View>
        )}
        <MentionInput
          style={styles.flex1}
          textInputStyle={styles.flex1}
          modalStyle={styles.mentionInputModal}
          modalPosition={'top'}
          onPress={onPressMentionAudience}
          onChangeText={onChangeText}
          value={content}
          ComponentInput={PostInput}
          title={t('post:mention_title')}
          emptyContent={t('post:mention_empty_content')}
          getDataPromise={postDataHelper.getSearchMentionAudiences}
          getDataParam={{group_ids: strGroupIds}}
          getDataResponseKey={'data'}
        />
        {!isEditPost && (
          <PostToolbar
            isOpenModal={isOpenModal}
            onOpenModal={onOpenPostToolbarModal}
            onCloseModal={onClosePostToolbarModal}
            modalizeRef={toolbarModalizeRef}
          />
        )}
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
