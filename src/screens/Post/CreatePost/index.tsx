import React, {FC, useEffect, useRef} from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text as RNText,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useBackHandler} from '@react-native-community/hooks';
import {isEqual} from 'lodash';

import PostToolbar from '~/beinComponents/BottomSheet/PostToolbar';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
// import MentionInput from '~/beinComponents/inputs/MentionInput';
import PostInput from '~/beinComponents/inputs/PostInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import {useRootNavigation} from '~/hooks/navigation';
import {useCreatePost} from '~/hooks/post';
import {useKeySelector} from '~/hooks/selector';
import {
  IActivityDataImage,
  IAudience,
  ICreatePostParams,
  IPayloadPutEditDraftPost,
  IPayloadPutEditPost,
  IPostActivity,
  IPostCreatePost,
  IPayloadCreateAutoSave,
  IPayloadPutEditAutoSave,
} from '~/interfaces/IPost';
import i18n from '~/localization';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {ITheme} from '~/theme/interfaces';
import {padding} from '~/theme/spacing';
import CreatePostChosenAudiences from '../components/CreatePostChosenAudiences';
import {IFilePicked} from '~/interfaces/common';
import modalActions from '~/store/modal/actions';
import FileUploader from '~/services/fileUploader';
import {useBaseHook} from '~/hooks';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {getResourceUrl, uploadTypes} from '~/configs/resourceConfig';
import CreatePostExitOptions from '~/screens/Post/components/CreatePostExitOptions';
import Div from '~/beinComponents/Div';
import {fontFamilies} from '~/theme/fonts';
import Button from '~/beinComponents/Button';
import _MentionInput from '~/beinComponents/inputs/_MentionInput';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const webContentMinHeight = 80;
const webContentInsetHeight = 18;

const CreatePost: FC<CreatePostProps> = ({route}: CreatePostProps) => {
  const toolbarModalizeRef = useRef();
  const mentionInputRef = useRef<any>();
  const {
    postId,
    draftPostId,
    replaceWithDetail,
    initAudience,
    createFromGroupId,
  } = route?.params || {};

  const webInputHeightAnimated = useRef(
    new Animated.Value(webContentMinHeight),
  ).current;

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = themeStyles(theme);

  const isWeb = Platform.OS === 'web';

  let initPostData: IPostActivity = {};
  if (postId) {
    initPostData = useKeySelector(postKeySelector.postById(postId));
  }
  if (draftPostId) {
    const draftPosts = useKeySelector(postKeySelector.draft.posts) || [];
    initPostData = draftPosts?.find(
      (item: IPostActivity) => item?.id === draftPostId,
    );
  }

  const createPostData = useCreatePost();
  const {
    loading,
    data,
    chosenAudiences = [],
    important,
    count,
  } = createPostData || {};
  const {content} = data || {};

  const initSelectingImagesRef = useRef();
  const selectingImages = useKeySelector(postKeySelector.createPost.images);
  const {images} = validateImages(selectingImages, t);

  const shouldScroll = selectingImages?.length > 0;

  const isEditPost = !!initPostData?.id;
  const isEditPostHasChange =
    content !== initPostData?.object?.data?.content ||
    !isEqual(selectingImages, initSelectingImagesRef.current);
  const isEditDraftPost = !!initPostData?.id && draftPostId;
  const isLimitEdit = isEditPost && !isEditDraftPost;

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
    (isEditPost && !isEditPostHasChange && !isEditDraftPost);

  const [isPause, setPause] = React.useState<boolean>(true);
  const [state, setState] = React.useState<IPostActivity>({...initPostData});

  const prevData = useRef<any>({selectingImages, chosenAudiences, important});
  const refStopsTyping = useRef<any>();
  const refAutoSave = useRef<any>();
  const refIsFocus = useRef<boolean>(false);
  const refIsRefresh = useRef<boolean>(false);

  const sPostId = state?.id;
  const isEdit = sPostId && !state?.is_draft ? true : false;
  const isDraftPost = sPostId && state?.is_draft ? true : false;
  const isNewsfeed = !(initPostData?.id && initPostData?.is_draft);

  const isAutoSave = isDraftPost || !isEdit ? true : false;

  useBackHandler(() => {
    onPressBack();
    return true;
  });

  useEffect(() => {
    debouncedAutoSave();
    return () => {
      clearTimeout(refAutoSave?.current);
      clearTimeout(refStopsTyping?.current);
    };
  }, [isPause]);

  useEffect(() => {
    debouncedStopsTyping();
  }, [content]);

  useEffect(() => {
    const list = [
      selectingImages?.length === prevData?.current?.selectingImages?.length,
      chosenAudiences?.length === prevData?.current?.chosenAudiences?.length,
      important?.active === prevData?.current?.important?.active,
    ];
    const newList = list.filter(i => !i);
    if (isAutoSave && newList.length > 0) {
      prevData.current = {selectingImages, chosenAudiences, important};
      autoSaveDraftPost();
    }
  }, [selectingImages?.length, chosenAudiences?.length, important]);

  useEffect(() => {
    setState({...initPostData});
  }, [initPostData?.id]);

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
    if (!initSelectingImagesRef?.current && selectingImages?.length > 0) {
      initSelectingImagesRef.current = selectingImages;
    }
  }, [selectingImages?.length]);

  useEffect(() => {
    if (initPostData && (isEditDraftPost || isEditPost)) {
      const initImages: any = [];
      initPostData?.object?.data?.images?.map(item => {
        initImages.push({
          fileName: item?.origin_name || item?.name,
          file: {
            name: item?.origin_name || item?.name,
            filename: item?.origin_name || item?.name,
            width: item?.width || 0,
            height: item?.height || 0,
          },
          url: item?.name?.includes('http')
            ? item.name
            : getResourceUrl(uploadTypes.postImage, item?.name),
        });
      });
      dispatch(postActions.setCreatePostImagesDraft(initImages));
      dispatch(postActions.setCreatePostImages(initImages));
    }
  }, [initPostData]);

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

  useEffect(() => {
    if (content && !mentionInputRef?.current?.getContent?.()) {
      mentionInputRef?.current?.setContent?.(content);
    }
  }, [content, images]);

  const onPressBack = () => {
    Keyboard.dismiss();

    // if (isEditPost && !isEditDraftPost) {
    //   if (isEditPostHasChange) {
    //     dispatch(
    //       modalActions.showAlert({
    //         title: i18n.t('common:label_discard_changes'),
    //         content: i18n.t('post:alert_content_back_edit_post'),
    //         showCloseButton: true,
    //         cancelBtn: true,
    //         cancelLabel: i18n.t('common:btn_continue_editing'),
    //         confirmLabel: i18n.t('common:btn_discard'),
    //         onConfirm: () => rootNavigation.goBack(),
    //         stretchOnWeb: true,
    //       }),
    //     );
    //     return;
    //   }
    // } else {
    //   if (content || chosenAudiences?.length > 0) {
    //     dispatch(
    //       modalActions.showModal({
    //         isOpen: true,
    //         ContentComponent: (
    //           <CreatePostExitOptions onPressSaveDraft={onPressSaveDraft} />
    //         ),
    //         props: {webModalStyle: {minHeight: undefined}},
    //       }),
    //     );
    //     return;
    //   }
    // }

    // rootNavigation.goBack();

    if (isEditPost && !isEditDraftPost) {
      if (isEditPostHasChange) {
        dispatch(
          modalActions.showAlert({
            title: i18n.t('common:label_discard_changes'),
            content: i18n.t('post:alert_content_back_edit_post'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: i18n.t('common:btn_continue_editing'),
            confirmLabel: i18n.t('common:btn_discard'),
            onConfirm: () => rootNavigation.goBack(),
            stretchOnWeb: true,
          }),
        );
        return;
      }
    } else if (sPostId && refIsRefresh.current) {
      if (!isNewsfeed) {
        dispatch(postActions.getDraftPosts({isRefresh: true}));
      }
      dispatch(
        modalActions.showHideToastMessage({
          content: 'post:saved_to_draft',
          props: {
            textProps: {
              useI18n: true,
              variant: 'bodyS',
              style: {color: colors.textPrimary},
            },
            type: 'informative',
            leftIcon: 'InfoCircle',
            leftIconColor: colors.iconTintReversed,
            leftIconStyle: {
              backgroundColor: colors.iconTintLight,
              padding: spacing.padding.tiny,
            },
            leftStyle: {
              marginRight: spacing.margin.small,
            },
            style: {
              backgroundColor: colors.background,
              borderLeftWidth: 4,
              borderLeftColor: colors.iconTintLight,
              paddingHorizontal: spacing.padding.large,
              marginHorizontal: spacing.margin.base,
              marginBottom: spacing.margin.small,
              borderWidth: 1,
              borderColor: colors.bgFocus,
            },
            rightText: isNewsfeed ? t('home:draft_post') : '',
            rightTextColor: colors.textPrimary,
            rightTextProps: {
              variant: 'bodySM',
            },
            rightTextStyle: {textDecorationLine: 'none'},
            onPressRight: onPressDraftPost,
          },
          toastType: 'normal',
        }),
      );
    }
    rootNavigation.goBack();
  };

  const onPressSaveDraft = async () => {
    if (isEditDraftPost && initPostData?.id) {
      await onPressPost(true, true);
    } else {
      await onPressPost(true);
    }
  };

  const onPressDraftPost = () => {
    if (isNewsfeed) {
      dispatch(postActions.getDraftPosts({isRefresh: true}));
      rootNavigation.navigate(homeStack.draftPost);
    }
  };

  const onPressPost = async (
    isSaveAsDraft?: boolean,
    isEditDraft?: boolean,
  ) => {
    const users: number[] = [];
    const groups: number[] = [];
    const audience = {group_ids: groups, user_ids: users};

    const {imageError, images} = validateImages(selectingImages, t);

    if (imageError) {
      dispatch(
        modalActions.showHideToastMessage({
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

    if (isDraftPost && sPostId) {
      const postData = {content, images, videos: [], files: []};
      const draftData: IPostCreatePost = {
        data: postData,
        audience,
      };
      if (important?.active) {
        draftData.important = {
          active: important?.active,
          expires_time: important?.expires_time,
        };
      }
      const payload: IPayloadPutEditDraftPost = {
        id: sPostId,
        replaceWithDetail: replaceWithDetail,
        data: draftData,
        publishNow: !isEditDraft,
      };
      dispatch(postActions.putEditDraftPost(payload));
    } else if (isEditPost && initPostData?.id) {
      const editPostData = {content, images, videos: [], files: []};
      const newEditData: IPostCreatePost = {
        data: editPostData,
        audience,
      };
      newEditData.important = {
        active: !!important?.active,
        expires_time: important?.expires_time,
      };
      const payload: IPayloadPutEditPost = {
        id: initPostData?.id,
        replaceWithDetail: replaceWithDetail,
        data: newEditData,
      };
      dispatch(postActions.putEditPost(payload));
    } else {
      const postData = {content, images, videos: [], files: []};
      const payload: IPostCreatePost = {
        data: postData,
        audience,
        is_draft: isSaveAsDraft,
        createFromGroupId,
      };
      if (important?.active) {
        payload.important = {
          active: important?.active,
          expires_time: important?.expires_time,
        };
      }
      dispatch(postActions.postCreateNewPost(payload));
    }
    Keyboard.dismiss();
  };

  const autoSaveDraftPost = async () => {
    setPause(true);

    try {
      const {imageError, images} = validateImages(selectingImages, t);

      const newContent = mentionInputRef?.current?.getContent?.() || content;

      if (
        (!newContent &&
          images.length === 0 &&
          chosenAudiences.length < 2 &&
          !important?.active &&
          !sPostId) ||
        !isAutoSave ||
        imageError
      ) {
        if (imageError) {
          dispatch(
            modalActions.showHideToastMessage({
              content: imageError,
              props: {textProps: {useI18n: true}, type: 'error'},
            }),
          );
        }
        return;
      }

      const users: number[] = [];
      const groups: number[] = [];

      chosenAudiences.map((selected: IAudience) => {
        if (selected.type === 'user') {
          users.push(Number(selected.id));
        } else {
          groups.push(Number(selected.id));
        }
      });
      const audience = {group_ids: groups, user_ids: users};

      const payload: IPayloadCreateAutoSave = {
        data: {
          content: newContent,
          images,
          videos: [],
          files: [],
        },
        audience,
        createFromGroupId,
      };

      if (important?.active) {
        payload.important = {
          active: important?.active,
          expires_time: important?.expiresTime,
        };
      }

      if (isDraftPost && sPostId) {
        const newPayload: IPayloadPutEditAutoSave = {
          id: sPostId,
          data: payload,
        };
        await postDataHelper.putEditPost({
          postId: newPayload?.id,
          data: newPayload?.data,
        });
        refIsRefresh.current = true;
      } else if (isEdit && sPostId) {
        if (__DEV__) console.log('payload: ', payload);
      } else {
        payload.is_draft = true;
        const resp = await postDataHelper.postCreateNewPost(payload);
        refIsRefresh.current = true;
        if (resp?.data) {
          const newData = resp?.data || {};
          setState({...newData});
        }
      }
      if (!isEdit) {
        dispatch(
          modalActions.showHideToastMessage({
            content: 'post:auto_saved',
            props: {
              textProps: {
                useI18n: true,
                variant: 'bodyS',
                style: {
                  color: colors.textSecondary,
                },
              },
              type: 'informative',
              leftIcon: 'Save',
              leftIconColor: colors.textSecondary,
              leftStyle: {
                marginRight: spacing.margin.tiny,
              },
              style: {
                backgroundColor: colors.transparent,
                paddingHorizontal: spacing.padding.large,
              },
            },
            toastType: 'normal',
          }),
        );
      }
    } catch (error) {
      if (__DEV__) console.log('error: ', error);
    }
  };

  const debouncedAutoSave = () => {
    if (!isPause) {
      refAutoSave.current = setTimeout(() => {
        setPause(true);
        autoSaveDraftPost();
      }, 5000);
    }
  };

  const debouncedStopsTyping = () => {
    if (isAutoSave && refIsFocus.current) {
      clearTimeout(refStopsTyping?.current);
      refStopsTyping.current = setTimeout(() => {
        clearTimeout(refAutoSave?.current);
        autoSaveDraftPost();
      }, 500);
    }
  };

  const onChangeText = (text: string) => {
    refIsFocus.current = true;
    if (isAutoSave && isPause) {
      setPause(false);
    }
    dispatch(postActions.setCreatePostData({...data, content: text}));
  };

  const onLayoutCloneText = (e: any) => {
    const newHeight = Math.max(
      e.nativeEvent.layout.height + webContentInsetHeight,
      webContentMinHeight,
    );
    Animated.timing(webInputHeightAnimated, {
      toValue: newHeight,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const onPressSettings = () => {
    rootNavigation.navigate(homeStack.postSettings);
  };

  const renderContent = () => {
    const Container = shouldScroll ? ScrollView : View;

    return (
      <Container style={shouldScroll ? {} : styles.flex1}>
        <View style={shouldScroll ? {} : styles.flex1}>
          {isWeb ? (
            <Animated.View
              style={
                shouldScroll ? {height: webInputHeightAnimated} : styles.flex1
              }>
              <View style={styles.textCloneContainer}>
                <RNText
                  onLayout={onLayoutCloneText}
                  style={styles.textContentClone}>
                  {content}
                </RNText>
              </View>
              <_MentionInput
                groupIds={strGroupIds}
                mentionInputRef={mentionInputRef}
                style={styles.flex1}
                textInputStyle={styles.flex1}
                autocompleteProps={{
                  modalPosition: 'bottom',
                  title: i18n.t('post:mention_title'),
                  emptyContent: i18n.t('post:mention_empty_content'),
                  showShadow: true,
                  modalStyle: {maxHeight: 350},
                }}
                // onPress={onPressMentionAudience}
                ComponentInput={PostInput}
                componentInputProps={{
                  value: content,
                  onChangeText,
                }}
                disabled={loading}
              />
            </Animated.View>
          ) : (
            <_MentionInput
              groupIds={strGroupIds}
              mentionInputRef={mentionInputRef}
              style={shouldScroll ? {} : styles.flex1}
              textInputStyle={shouldScroll ? {} : styles.flex1}
              ComponentInput={PostInput}
              componentInputProps={{
                value: content,
                onChangeText,
              }}
              autocompleteProps={{
                modalPosition: 'bottom',
                emptyContent: i18n.t('post:mention_empty_content'),
                showShadow: true,
                modalStyle: {maxHeight: 350},
                fullWidth: true,
              }}
              // title={i18n.t('post:mention_title')}
              disabled={loading}
            />
          )}
          <PostPhotoPreview
            data={images || []}
            style={{alignSelf: 'center'}}
            uploadType={uploadTypes.postImage}
            onPress={() => rootNavigation.navigate(homeStack.postSelectImage)}
          />
        </View>
      </Container>
    );
  };

  return (
    <ScreenWrapper isFullView testID={'CreatePostScreen'}>
      <Header
        titleTextProps={{useI18n: true}}
        title={isEdit ? 'post:title_edit_post' : 'post:create_post'}
        buttonText={isEdit ? 'common:btn_publish' : 'post:post_button'}
        buttonProps={{
          loading: loading,
          disabled: disableButtonPost,
          useI18n: true,
          highEmphasis: true,
        }}
        onPressBack={onPressBack}
        onPressButton={() => onPressPost(false)}
      />
      {!isLimitEdit && (
        <View>
          {!!important?.active && <ImportantStatus notExpired />}
          <CreatePostChosenAudiences disabled={loading} />
          <Divider />
        </View>
      )}
      {renderContent()}
      {(!sPostId || isDraftPost) && (
        <View style={styles.setting}>
          <Button.Secondary
            color={colors.bgHover}
            leftIcon="SlidersVAlt"
            style={styles.buttonSettings}
            onPress={onPressSettings}
            textProps={{color: colors.textPrimary, style: {fontSize: 14}}}>
            {t('post:settings') + (count > 0 ? ` (${count})` : '')}
          </Button.Secondary>
        </View>
      )}
      <Div className="post-toolbar-container">
        <PostToolbar modalizeRef={toolbarModalizeRef} disabled={loading} />
      </Div>
    </ScreenWrapper>
  );
};

const validateImages = (
  selectingImages: IFilePicked[] | IActivityDataImage[],
  t: any,
) => {
  let imageError = '';
  const images: IActivityDataImage[] = [];
  // @ts-ignore
  selectingImages?.map?.((item: any) => {
    if (item?.url) {
      images.push({
        name: item?.url || '',
        origin_name: item?.fileName,
        width: item?.file?.width,
        height: item?.file?.height,
      });
    } else {
      const {file, fileName} = item || {};
      const {url, uploading} =
        FileUploader.getInstance().getFile(fileName) || {};
      if (uploading) {
        imageError = t('post:error_wait_uploading');
      } else if (!url) {
        imageError = t('error_upload_failed');
      }
      images.push({
        name: url || '',
        origin_name: fileName,
        width: file?.width,
        height: file?.height,
      });
    }
  });
  return {imageError, images};
};

const themeStyles = (theme: ITheme) => {
  const {spacing, dimension, colors} = theme;

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
    textContentClone: {
      position: 'absolute',
      top: 1,
      left: 1,
      opacity: 0,
      padding: spacing?.padding.base,
      fontSize: dimension?.sizes.body,
      fontFamily: fontFamilies.OpenSans,
      color: colors.success,
    },
    textCloneContainer: {height: 0, overflow: 'hidden'},
    setting: {
      padding: spacing?.padding.large,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
    },
    buttonSettings: {
      backgroundColor: colors.bgHover,
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default CreatePost;
