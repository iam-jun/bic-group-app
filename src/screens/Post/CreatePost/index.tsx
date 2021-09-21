import React, {FC, useEffect, useRef} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import PostToolbar from '~/beinComponents/BottomSheet/PostToolbar';
import Divider from '~/beinComponents/Divider';

import Header from '~/beinComponents/Header';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import PostInput from '~/beinComponents/inputs/PostInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import {useRootNavigation} from '~/hooks/navigation';
import {useCreatePost} from '~/hooks/post';
import {useKeySelector} from '~/hooks/selector';
import {
  IActivityDataImage,
  IAudience,
  ICreatePostParams,
  IPayloadPutEditPost,
  IPostActivity,
  IPostCreatePost,
} from '~/interfaces/IPost';
import i18n from '~/localization';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {padding} from '~/theme/spacing';
import CreatePostChosenAudiences from '../components/CreatePostChosenAudiences';
import Text from '~/beinComponents/Text';
import {IFilePicked} from '~/interfaces/common';
import {showHideToastMessage} from '~/store/modal/actions';
import FileUploader from '~/services/fileUploader';
import {useBaseHook} from '~/hooks';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const CreatePost: FC<CreatePostProps> = ({route}: CreatePostProps) => {
  const toolbarModalizeRef = useRef();
  const {postId, replaceWithDetail, initAudience} = route?.params || {};

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);

  let initPostData: IPostActivity = {};
  if (postId) {
    initPostData = useKeySelector(postKeySelector.postById(postId));
  }

  const createPostData = useCreatePost();
  const {loading, data, chosenAudiences = [], important} = createPostData || {};
  const {content} = data || {};

  const selectingImages = useKeySelector(postKeySelector.createPost.images);

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
      dispatch(postActions.setCreatePostImagesDraft([]));
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
    const title = i18n.t('common:label_discard_changes');
    const cancelLabel = i18n.t('common:btn_continue_editing');
    const confirmLabel = i18n.t('common:btn_discard');

    if (isEditPost) {
      if (isEditPostHasChange) {
        dispatch(
          modalActions.showAlert({
            title: title,
            content: i18n.t('post:alert_content_back_edit_post'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: cancelLabel,
            confirmLabel: confirmLabel,
            onConfirm: () => rootNavigation.goBack(),
            stretchOnWeb: true,
          }),
        );
        return;
      }
    } else {
      if (content) {
        dispatch(
          modalActions.showAlert({
            title: title,
            content: i18n.t('post:alert_content_back_create_post'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: cancelLabel,
            confirmLabel: confirmLabel,
            onConfirm: () => rootNavigation.goBack(),
            stretchOnWeb: true,
          }),
        );
        return;
      }
    }
    rootNavigation.goBack();
  };

  const validateImages = (selectingImages: IFilePicked[]) => {
    let imageError = '';
    const images: IActivityDataImage[] = [];
    selectingImages?.map?.(item => {
      const {file, fileName} = item || {};
      const {url, uploading} =
        FileUploader.getInstance().getFile(fileName) || {};
      if (uploading) {
        imageError = t('post:error_wait_uploading');
      } else if (!url) {
        imageError = t('error_upload_failed');
      } else {
        images.push({
          name: url,
          origin_name: fileName,
          width: file?.width,
          height: file?.height,
        });
      }
    });
    return {imageError, images};
  };

  const onPressPost = async () => {
    const users: number[] = [];
    const groups: number[] = [];
    const audience = {groups, users};

    const {imageError, images} = validateImages(selectingImages);

    if (imageError) {
      dispatch(
        showHideToastMessage({
          content: imageError,
          props: {textProps: {useI18n: true}, type: 'error'},
        }),
      );
      return;
    }

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
      const postData = {content, images, videos: [], files: []};
      const payload: IPostCreatePost = {data: postData, audience};
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
            <CreatePostChosenAudiences disabled={loading} />
            <Divider />
          </View>
        )}
        <MentionInput
          style={styles.flex1}
          textInputStyle={styles.flex1}
          modalStyle={styles.mentionInputModal}
          modalPosition={'bottom'}
          onPress={onPressMentionAudience}
          onChangeText={onChangeText}
          value={content}
          ComponentInput={PostInput}
          title={i18n.t('post:mention_title')}
          emptyContent={i18n.t('post:mention_empty_content')}
          getDataPromise={postDataHelper.getSearchMentionAudiences}
          getDataParam={{group_ids: strGroupIds}}
          getDataResponseKey={'data'}
          disabled={loading}
        />
        <View>
          <Text>selected {selectingImages.length} image</Text>
        </View>
        {!isEditPost && (
          <PostToolbar modalizeRef={toolbarModalizeRef} disabled={loading} />
        )}
      </ScreenWrapper>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      flex: 1,
    },
    header: {
      justifyContent: 'space-between',
    },
    sendTo: {
      marginHorizontal: spacing.margin.big,
      marginVertical: spacing.margin.base,
    },
    chooseAudience: {
      marginHorizontal: spacing.margin.small,
      marginVertical: spacing.margin.base,
      borderRadius: 50,
      paddingHorizontal: padding.base,
      paddingVertical: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContent: {
      minHeight: 500,
      marginVertical: spacing.margin.base,
      marginHorizontal: spacing.margin.big,
    },
    button: {
      height: 35,
    },
    actionList: {
      justifyContent: 'flex-end',
      marginVertical: spacing.margin.big,
    },
    audienceList: {
      marginBottom: spacing.margin.large,
      marginHorizontal: spacing.margin.large,
    },
    mentionInputModal: {
      maxHeight: 180,
    },
  });
};

export default CreatePost;
