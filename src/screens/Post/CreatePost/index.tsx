import React, {FC, useEffect, useRef} from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text as RNText,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useBackHandler} from '@react-native-community/hooks';
import {isEqual, isEmpty, differenceWith} from 'lodash';

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
  IParamGetPostAudiences,
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
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const webContentMinHeight = 46;
const webContentInsetHeight = 24;

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

  const initSelectingImagesRef = useRef([]);
  const initGroupsRef = useRef<any>([]);
  const initUsersRef = useRef<any>([]);
  const selectingImages = useKeySelector(postKeySelector.createPost.images);
  const {images} = validateImages(selectingImages, t);

  const shouldScroll = selectingImages?.length > 0;

  const users: number[] = [];
  const groups: number[] = [];
  const audience = {group_ids: groups, user_ids: users};
  chosenAudiences.map((selected: IAudience) => {
    if (selected.type === 'user') {
      users.push(Number(selected.id));
    } else {
      groups.push(Number(selected.id));
    }
  });

  const isAudienceHasChange =
    !isEqual(initGroupsRef.current, groups) ||
    !isEqual(initUsersRef.current, users);
  const isImageHasChange = !isEqual(
    selectingImages,
    initSelectingImagesRef.current,
  );

  const isEditPost = !!initPostData?.id;
  const isEditPostHasChange =
    content !== initPostData?.object?.data?.content ||
    isImageHasChange ||
    isAudienceHasChange;
  const isEditDraftPost = !!initPostData?.id && draftPostId;

  const groupIds: any[] = [];
  chosenAudiences.map((selected: IAudience) => {
    if (selected.type !== 'user') {
      groupIds.push(selected.id);
    }
  });
  const strGroupIds = groupIds.join(',');

  // Disable button post if loading, empty content, empty audience or edit post but nothing changed
  const disableButtonPost =
    loading ||
    content?.length === 0 ||
    chosenAudiences.length === 0 ||
    (isEditPost && !isEditPostHasChange && !isEditDraftPost);

  const [isPause, setPause] = React.useState<boolean>(true);
  const [isShowToastAutoSave, setShowToastAutoSave] =
    React.useState<boolean>(false);
  const [sPostData, setPostData] = React.useState<IPostActivity>({
    ...initPostData,
  });
  const [webPhotosHeight, setWebPhotosHeight] = React.useState<number>(0);
  const [sIsLoading, setLoading] = React.useState<boolean>(false);

  const prevData = useRef<any>({
    selectingImages,
    chosenAudiences,
    count,
    important,
  });
  const refStopsTyping = useRef<any>();
  const refAutoSave = useRef<any>();
  const refIsFocus = useRef<boolean>(false);
  const refIsRefresh = useRef<boolean>(false);
  const refToastAutoSave = useRef<any>();
  const refTextInput = useRef<any>();
  const refRNText = useRef<any>();
  const currentWebInputHeight = useRef<number>(webContentMinHeight);

  const sPostId = sPostData?.id;
  const isEdit = !!(sPostId && !sPostData?.is_draft);
  const isDraftPost = !!(sPostId && sPostData?.is_draft);
  const isNewsfeed = !(initPostData?.id && initPostData?.is_draft);

  const isAutoSave = isDraftPost || !isEdit ? true : false;

  useBackHandler(() => {
    onPressBack();
    return true;
  });

  useEffect(() => {
    debouncedAutoSave();
    return () => {
      clearTimeout(refToastAutoSave?.current);
      clearTimeout(refAutoSave?.current);
      clearTimeout(refStopsTyping?.current);
    };
  }, [isPause]);

  useEffect(() => {
    debouncedStopsTyping();
  }, [content]);

  useEffect(() => {
    const dataChangeList = [
      isEmpty(
        differenceWith(
          selectingImages,
          prevData?.current?.selectingImages,
          isEqual,
        ),
      ),
      isEmpty(
        differenceWith(
          chosenAudiences,
          prevData?.current?.chosenAudiences,
          isEqual,
        ),
      ),
      isEqual(important, prevData?.current?.important),
    ];
    const newDataChange = dataChangeList.filter(i => !i);
    if (isAutoSave && newDataChange.length > 0) {
      prevData.current = {
        ...prevData.current,
        selectingImages,
        chosenAudiences,
        important,
      };
      autoSaveDraftPost();
    }
  }, [
    JSON.stringify(selectingImages),
    JSON.stringify(chosenAudiences),
    important,
  ]);

  useEffect(() => {
    if (isWeb) {
      onLayoutAnimated();
    }
  }, [webPhotosHeight, isShowToastAutoSave, content]);

  useEffect(() => {
    setPostData({...initPostData});
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
    if (initPostData && (isEditDraftPost || isEditPost)) {
      //get post audience for select audience screen and check audience has changed
      initPostData?.audience?.groups?.map?.(g =>
        initGroupsRef.current.push(Number(g?.id)),
      );
      initPostData?.audience?.users?.map?.(u =>
        initUsersRef.current.push(Number(u?.id)),
      );
      const p: IParamGetPostAudiences = {
        group_ids: initGroupsRef.current.join(','),
      };
      dispatch(postActions.getCreatePostInitAudience(p));

      //handle selected, uploaded post's image
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
      initSelectingImagesRef.current = initImages;
      prevData.current = {...prevData.current, selectingImages: initImages};
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
      dispatch(
        postActions.setCreatePostCurrentSettings({important: initImportant}),
      );
      prevData.current = {
        ...prevData.current,
        chosenAudiences: initChosenAudience,
        important: initImportant,
      };
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
            title: i18n.t('post:create_post:title_discard_changes'),
            content: i18n.t('post:alert_content_back_edit_post'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: i18n.t('common:btn_discard'),
            confirmLabel: i18n.t('post:create_post:btn_keep_edit'),
            onDismiss: () => rootNavigation.goBack(),
            stretchOnWeb: true,
          }),
        );
        return;
      }
    } else if (sPostId && refIsRefresh.current) {
      dispatch(postActions.getDraftPosts({isRefresh: true}));
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
    if (loading) {
      return;
    }

    if (!isEdit) {
      clearTimeout(refAutoSave?.current);
      clearTimeout(refStopsTyping?.current);
    }

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
        replaceWithDetail: true,
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
        ...(important?.expires_time
          ? {expires_time: important?.expires_time}
          : {}),
      };
      const payload: IPayloadPutEditPost = {
        id: initPostData?.id,
        replaceWithDetail: replaceWithDetail,
        data: newEditData,
        onRetry: () => onPressPost(isSaveAsDraft, isEditDraft),
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
      if (sIsLoading && !sPostId) {
        return;
      }
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
          expires_time: important?.expires_time,
        };
      }

      if (!isEdit) {
        dispatch(postActions.setSavingDraftPost(true));
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
        setLoading(true);
        payload.is_draft = true;
        const resp = await postDataHelper.postCreateNewPost(payload);
        refIsRefresh.current = true;
        if (resp?.data) {
          const newData = resp?.data || {};
          setPostData({...newData});
        }
        setLoading(false);
      }
      if (!isEdit) {
        dispatch(postActions.setSavingDraftPost(false));
        setShowToastAutoSave(true);
        clearTimeout(refToastAutoSave?.current);
        refToastAutoSave.current = setTimeout(() => {
          setShowToastAutoSave(false);
        }, 2000);
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

  const onLayoutPhotoPreview = (e: any) => {
    setWebPhotosHeight(e.nativeEvent.layout.height);
  };

  const onLayoutAnimated = () => {
    refRNText.current.measure(
      (ox: any, oy: any, width: number, height: number) => {
        const toastHeight = isShowToastAutoSave ? 34 : 0;
        const newHeight = Math.max(
          height + webContentInsetHeight + webPhotosHeight + toastHeight,
          webContentMinHeight + webPhotosHeight + toastHeight,
        );
        if (currentWebInputHeight.current === newHeight) {
          return;
        }
        currentWebInputHeight.current = newHeight;
        Animated.timing(webInputHeightAnimated, {
          toValue: newHeight,
          duration: 10,
          useNativeDriver: false,
        }).start();
      },
    );
  };

  const onPressSettings = () => {
    rootNavigation.navigate(homeStack.postSettings);
  };

  const onPressInput = () => {
    refTextInput.current?.setFocus();
  };

  const renderContent = () => {
    // const Container = shouldScroll ? ScrollView : View;

    return (
      <ScrollView>
        <View style={styles.flex1}>
          {isWeb ? (
            <>
              <View style={styles.textCloneContainer}>
                <RNText
                  style={styles.textContentClone}
                  //   onLayout={onLayoutCloneText}
                  ref={refRNText}>
                  {content + '.'}
                </RNText>
              </View>
              <Animated.View style={{height: webInputHeightAnimated}}>
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
                    inputRef: refTextInput,
                  }}
                  disabled={loading}
                />
                {renderToastAutoSave()}
                <View onLayout={onLayoutPhotoPreview}>
                  <PostPhotoPreview
                    data={images || []}
                    style={{alignSelf: 'center'}}
                    uploadType={uploadTypes.postImage}
                    onPress={() =>
                      rootNavigation.navigate(homeStack.postSelectImage)
                    }
                  />
                </View>
              </Animated.View>
            </>
          ) : (
            <>
              <_MentionInput
                groupIds={strGroupIds}
                mentionInputRef={mentionInputRef}
                style={{minHeight: 55}}
                //   textInputStyle={shouldScroll ? {} : styles.flex1}
                ComponentInput={PostInput}
                componentInputProps={{
                  value: content,
                  onChangeText,
                  inputRef: refTextInput,
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
              {renderToastAutoSave()}
              <PostPhotoPreview
                data={images || []}
                style={{alignSelf: 'center'}}
                uploadType={uploadTypes.postImage}
                onPress={() =>
                  rootNavigation.navigate(homeStack.postSelectImage)
                }
              />
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderToastAutoSave = () => {
    if (isShowToastAutoSave) {
      return (
        <View style={styles.toastAutoSave}>
          <Icon
            isButton
            iconStyle={styles.iconToastAutoSave}
            style={styles.iconToastAutoSaveContainer}
            size={18}
            icon="Save"
            tintColor={colors.textSecondary}
          />
          <Text variant="bodyS" useI18n style={styles.textToastAutoSave}>
            post:auto_saved
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper isFullView testID={'CreatePostScreen'}>
      <Header
        titleTextProps={{useI18n: true}}
        title={isEdit ? 'post:title_edit_post' : 'post:title_create_post'}
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
      <TouchableOpacity
        style={styles.flex1}
        onPress={onPressInput}
        activeOpacity={1}>
        <View>
          {!!important?.active && <ImportantStatus notExpired />}
          <CreatePostChosenAudiences disabled={loading} />
          <Divider />
        </View>
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
      </TouchableOpacity>
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
      left: 12,
      right: 12,
      opacity: 0,
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
    toastAutoSave: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.base,
    },
    iconToastAutoSaveContainer: {marginRight: spacing.margin.tiny},
    iconToastAutoSave: {
      padding: 2,
      borderRadius: 6,
      backgroundColor: colors.iconTintReversed,
    },
    textToastAutoSave: {color: colors.textSecondary},
  });
};

export default CreatePost;
