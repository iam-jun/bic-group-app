import React, {FC, useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Icon from '~/beinComponents/Icon';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import PostInput from '~/beinComponents/inputs/PostInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import {uploadTypes} from '~/configs/resourceConfig';
import {useBaseHook} from '~/hooks';
import {useKeyboardStatus} from '~/hooks/keyboard';
import {useBackPressListener, useRootNavigation} from '~/hooks/navigation';
import {IAudience, ICreatePostParams} from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import CreatePostFooter from '~/screens/Post/CreatePost/CreatePostFooter';
import useCreatePost from '~/screens/Post/CreatePost/useCreatePost';
import postActions from '~/screens/Post/redux/actions';
import modalActions from '~/store/modal/actions';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';
import {padding} from '~/theme/spacing';
import CreatePostChosenAudiences from '../components/CreatePostChosenAudiences';
import UploadingFile from '~/beinComponents/UploadingFile';
import {IFilePicked} from '~/interfaces/common';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const contentMinHeight = 46;
const contentInsetHeight = 24;
const inputMinHeight = 22;
const toastMinHeight = 36;

const CreatePost: FC<CreatePostProps> = ({route}: CreatePostProps) => {
  const toolbarRef = useRef<any>();
  const mentionInputRef = useRef<any>();
  const screenParams = route?.params || {};
  let deviceVersion = 0;
  const isAndroid = Platform.OS === 'android';
  if (isAndroid) {
    const systemVersion = DeviceInfo.getSystemVersion();
    deviceVersion = parseInt(systemVersion);
  }
  const isAndroidAnimated = isAndroid && deviceVersion === 8;
  const isWeb = Platform.OS === 'web';
  const isAnimated = isAndroidAnimated || isWeb;

  const {height} = useWindowDimensions();
  const minInputHeight = height * 0.3;
  const contentHeight = height * 0.65;
  const inputMaxHeight = contentHeight < 600 ? contentHeight : 600;

  const {isOpen: isKeyboardOpen} = useKeyboardStatus();
  const heightAnimated = useRef(new Animated.Value(contentMinHeight)).current;
  const toastHeightAnimated = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = themeStyles(theme);

  const {
    refIsRefresh,
    isShowToastAutoSave,
    sPostData,
    createPostData,
    images,
    video,
    disableButtonPost,
    isEditPost,
    isEditDraftPost,
    isEditPostHasChange,
    handlePressPost,
    handleChangeContent,
    isNewsfeed,
    handleUploadVideoSuccess,
    handleUploadVideoError,
  } = useCreatePost({
    screenParams,
    mentionInputRef,
  });

  const {
    loading,
    data,
    chosenAudiences = [],
    important,
    count,
  } = createPostData || {};
  const {content} = data || {};

  const groupIds: any[] = [];
  chosenAudiences.map((selected: IAudience) => {
    if (selected.type !== 'user') {
      groupIds.push(selected.id);
    }
  });
  const strGroupIds = groupIds.join(',');

  const [photosHeight, setPhotosHeight] = React.useState<number>(0);
  const [inputHeight, setInputHeight] = React.useState<number>(0);
  const [contentInput, setContentInput] = React.useState<string>(content);

  const refTextInput = useRef<any>();
  const refRNText = useRef<any>();
  const currentInputHeight = useRef<number>(contentMinHeight);

  const sPostId = sPostData?.id;
  const isEdit = !!(sPostId && !sPostData?.isDraft);
  const isDraftPost = !!(sPostId && sPostData?.isDraft);

  const handleBackPress = () => {
    toolbarRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  useEffect(() => {
    if (content !== contentInput && isAnimated) {
      setContentInput(content);
    }
  }, [content]);

  useEffect(() => {
    if (isAnimated) {
      onLayoutAnimated();
    }
  }, [photosHeight, isShowToastAutoSave, inputHeight, isKeyboardOpen]);

  useEffect(() => {
    // disable clear data for flow select audience before create post
    // dispatch(postActions.clearCreatPostData());
    // dispatch(postActions.setSearchResultAudienceGroups([]));
    // dispatch(postActions.setSearchResultAudienceUsers([]));
    if (screenParams?.initAudience?.id) {
      dispatch(
        postActions.setCreatePostChosenAudiences(
          new Array(screenParams?.initAudience),
        ),
      );
    }
    return () => {
      dispatch(postActions.clearCreatPostData());
      dispatch(postActions.setSearchResultAudienceGroups([]));
      dispatch(postActions.setSearchResultAudienceUsers([]));
      dispatch(postActions.setCreatePostImagesDraft([]));

      //clear comment because of comment input view listen emit event change text
      dispatch(postActions.setCreateComment({content: '', loading: false}));
    };
  }, []);

  useEffect(() => {
    if (content && !mentionInputRef?.current?.getContent?.()) {
      mentionInputRef?.current?.setContent?.(content);
    }
  }, [content, images]);

  const onPressBack = () => {
    Keyboard.dismiss();
    if (isEditPost && !isEditDraftPost) {
      if (isEditPostHasChange) {
        dispatch(
          modalActions.showAlert({
            title: t('post:create_post:title_discard_changes'),
            content: t('post:alert_content_back_edit_post'),
            showCloseButton: true,
            cancelBtn: true,
            cancelLabel: t('common:btn_discard'),
            confirmLabel: t('post:create_post:btn_keep_edit'),
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

  const onPressDraftPost = () => {
    if (isNewsfeed) {
      dispatch(postActions.getDraftPosts({isRefresh: true}));
      rootNavigation.navigate(homeStack.draftPost);
    }
  };

  const onPressPost = async () => {
    handlePressPost();
  };

  const onChangeText = (text: string) => {
    if (isAnimated) {
      setContentInput(text);
    }
    handleChangeContent(text);
  };

  const onLayoutPhotoPreview = (e: any) => {
    setPhotosHeight(e?.nativeEvent?.layout?.height || 0);
  };

  const onLayoutCloneText = (e: any) => {
    const height = e?.nativeEvent?.layout?.height || inputMinHeight;
    setInputHeight(height);
  };

  const onLayoutAnimated = () => {
    let newInputHeight = inputHeight;
    if (isAndroidAnimated && newInputHeight > inputMaxHeight) {
      newInputHeight = inputMaxHeight;
    }
    if (isAndroidAnimated) {
      newInputHeight =
        isKeyboardOpen && newInputHeight > minInputHeight
          ? minInputHeight
          : newInputHeight;
    }
    const toastHeight = isShowToastAutoSave ? toastMinHeight : 0;
    const newHeight = Math.max(
      newInputHeight + contentInsetHeight + photosHeight + toastHeight,
      contentMinHeight + photosHeight + toastHeight,
    );
    if (currentInputHeight.current === newHeight) {
      return;
    }
    currentInputHeight.current = newHeight;
    animatedTiming(newHeight, toastHeight);
  };

  const animatedTiming = (height: number, toastHeight: number) => {
    heightAnimated.stopAnimation();
    Animated.timing(heightAnimated, {
      toValue: height,
      duration: 0,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
    toastHeightAnimated.stopAnimation();
    Animated.timing(toastHeightAnimated, {
      toValue: toastHeight,
      duration: toastHeight === 0 ? 0 : 50,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  const onPressSettings = () => {
    rootNavigation.navigate(homeStack.postSettings);
  };

  const onPressInput = () => {
    refTextInput.current?.setFocus();
  };

  const onCloseFile = (file: any) => {
    dispatch(postActions.setCreatePostVideo());
  };

  const renderContent = () => {
    return (
      <>
        {isAnimated && (
          <View
            testID={'create_post.clone_text_container'}
            style={styles.textCloneContainer}>
            <RNText
              style={styles.textContentClone}
              onLayout={onLayoutCloneText}
              ref={refRNText}>
              {contentInput + '.'}
            </RNText>
          </View>
        )}
        <ScrollView bounces={false} keyboardShouldPersistTaps="always">
          <View style={styles.flex1}>
            <Animated.View
              style={isAnimated ? {height: heightAnimated} : styles.flex1}>
              <MentionInput
                disableAutoComplete={Platform.OS !== 'web'}
                groupIds={strGroupIds}
                mentionInputRef={mentionInputRef}
                style={styles.flex1}
                textInputStyle={styles.flex1}
                autocompleteProps={{
                  modalPosition: 'bottom',
                  title: t('post:mention_title'),
                  emptyContent: t('post:mention_empty_content'),
                  showShadow: true,
                  modalStyle: {maxHeight: 350},
                }}
                ComponentInput={PostInput}
                componentInputProps={{
                  value: content,
                  onChangeText,
                  inputRef: refTextInput,
                  scrollEnabled: false,
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
                <UploadingFile
                  uploadType={uploadTypes.postVideo}
                  file={video as IFilePicked}
                  onClose={onCloseFile}
                  onSuccess={handleUploadVideoSuccess}
                  onError={handleUploadVideoError}
                />
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </>
    );
  };

  const renderToastAutoSave = () => {
    return (
      <Animated.View
        style={
          isAnimated ? {overflow: 'hidden', height: toastHeightAnimated} : {}
        }>
        {isShowToastAutoSave && (
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
        )}
      </Animated.View>
    );
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
          style: {borderWidth: 0},
          testID: 'create_post.btn_post',
        }}
        onPressBack={onPressBack}
        onPressButton={onPressPost}
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
        <View style={styles.setting}>
          <Button.Secondary
            testID="create_post.btn_post_settings"
            color={colors.bgHover}
            leftIcon="SlidersVAlt"
            style={styles.buttonSettings}
            onPress={onPressSettings}
            textProps={{color: colors.textPrimary, style: {fontSize: 14}}}>
            {t('post:settings') + (count > 0 ? ` (${count})` : '')}
          </Button.Secondary>
        </View>
        <CreatePostFooter
          toolbarRef={toolbarRef}
          loading={loading}
          onPressBack={onPressBack}
        />
      </TouchableOpacity>
    </ScreenWrapper>
  );
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
