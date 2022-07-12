import {isEmpty, throttle} from 'lodash';
import React, {useImperativeHandle, useRef, useState} from 'react';
import {
  Animated,
  Keyboard,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {GestureEvent} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import BottomSheet from '~/beinComponents/BottomSheet/index';
import DocumentPicker from '~/beinComponents/DocumentPicker';
import Icon from '~/beinComponents/Icon';
import ImagePicker from '~/beinComponents/ImagePicker';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import {tryOpenURL} from '~/beinComponents/Markdown/utils/url.js';
import Text from '~/beinComponents/Text';
import appConfig from '~/configs/appConfig';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {ICreatePostImage} from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {showHideToastMessage} from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {getChatDomain} from '~/utils/link';
import {checkPermission} from '~/utils/permission';
import {clearExistingFiles, validateFilesPicker} from '../CreatePost/helper';
import {getTotalFileSize} from '../redux/selectors';
import ReviewMarkdown from './ReviewMarkdown';

export interface PostToolbarProps {
  toolbarRef?: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  imageDisabled?: boolean;
  videoDisabled?: boolean;
  fileDisabled?: boolean;
  onPressBack?: () => void;
}

const PostToolbar = ({
  toolbarRef,
  style,
  containerStyle,
  imageDisabled,
  videoDisabled,
  fileDisabled,
  onPressBack,
  ...props
}: PostToolbarProps) => {
  const animated = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);
  const modalizeRef = useRef<any>();

  const selectedImage: ICreatePostImage[] = useKeySelector(
    postKeySelector.createPost.images,
  );
  const content = useKeySelector(postKeySelector.createPost.content);
  const selectedFiles = useKeySelector(postKeySelector.createPost.files);
  const {totalFiles, totalSize} = getTotalFileSize();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = throttle((e?: any) => {
    Keyboard.dismiss();
    setIsOpen(true);
    modalizeRef?.current?.open?.(e?.pageX, e?.pageY);
  }, 500);

  const closeModal = () => {
    setIsOpen(false);
    modalizeRef?.current?.close?.();
  };

  const goBack = () => {
    if (isOpen) {
      closeModal();
    } else {
      onPressBack?.();
    }
    return true;
  };

  useImperativeHandle(toolbarRef, () => ({
    openModal,
    closeModal,
    goBack,
  }));

  const handleGesture = (event: GestureEvent<any>) => {
    const {nativeEvent} = event;
    if (nativeEvent.velocityY < 0) {
      openModal();
    }
  };

  const onPressMarkdownPreview = (e: any) => {
    openModal(e);
  };

  const _onPressSelectImage = () => {
    modalizeRef?.current?.close?.();
    checkPermission('photo', dispatch, canOpenPicker => {
      if (canOpenPicker) {
        openGallery();
      }
    });
  };

  const _onPressSelectVideo = () => {
    modalizeRef?.current?.close?.();
    checkPermission('photo', dispatch, canOpenPicker => {
      if (canOpenPicker) {
        openSingleVideoPicker();
      }
    });
  };

  const openSingleVideoPicker = () => {
    ImagePicker.openPickerSingle({mediaType: 'video'})
      .then(selected => {
        const data = selected;
        dispatch(postActions.setCreatePostVideo(data));
      })
      .catch(e => {
        console.log(`\x1b[36m🐣️ openSingleVideoPicker error: \x1b[0m`, e);
      });
  };

  const openGallery = () => {
    ImagePicker.openPickerMultiple()
      .then(images => {
        const newImages: ICreatePostImage[] = [];
        images.map(item => {
          newImages.push({fileName: item.filename, file: item});
        });
        let newImageDraft = [...selectedImage, ...newImages];
        if (newImageDraft.length > appConfig.postPhotoLimit) {
          newImageDraft = newImageDraft.slice(0, appConfig.postPhotoLimit);
          const errorContent = t('post:error_reach_upload_photo_limit').replace(
            '%LIMIT%',
            appConfig.postPhotoLimit,
          );
          dispatch(
            showHideToastMessage({
              content: errorContent,
              props: {textProps: {useI18n: true}, type: 'error'},
            }),
          );
        }
        dispatch(postActions.setCreatePostImagesDraft(newImageDraft));
        rootNavigation.navigate(homeStack.postSelectImage);
      })
      .catch(e => {
        console.log(`\x1b[36m🐣️ openPickerMultiple error: \x1b[0m`, e);
      });
  };

  const onPressAddFile = async () => {
    try {
      const files: any = await DocumentPicker.openPickerMultiple();
      const validFiles = validateFilesPicker(
        files,
        totalFiles,
        totalSize,
        dispatch,
      );
      if (validFiles.length === 0) return;

      const newFiles = clearExistingFiles(selectedFiles, validFiles);
      if (isEmpty(newFiles)) return;

      dispatch(postActions.addCreatePostFiles(newFiles));
    } catch (e) {
      console.log(
        `\x1b[36m🐣️ DocumentPicker.openPickerSingle error: \x1b[0m`,
        e,
      );
    }
  };

  const onPressHelp = () => {
    const DOMAIN = getChatDomain();
    tryOpenURL(`${DOMAIN}/help/formatting`);
  };

  const renderToolbarButton = (
    icon: any,
    testID: string,
    onPressIcon?: (e: any) => void,
  ) => {
    const tintColor = onPressIcon ? colors.iconTint : colors.textDisabled;

    return (
      <View style={styles.toolbarButton}>
        <Icon
          size={20}
          tintColor={tintColor}
          icon={icon}
          buttonTestID={testID}
          onPress={onPressIcon}
        />
      </View>
    );
  };

  const renderToolbar = () => {
    return (
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={containerStyle}>
          <View
            style={StyleSheet.flatten([styles.toolbarStyle, style])}
            testID="post_toolbar">
            {renderToolbarButton(
              'CreditCardSearch',
              'post_toolbar.markdown_preview',
              content && onPressMarkdownPreview,
            )}
            {renderToolbarButton(
              'Image',
              'post_toolbar.add_photo',
              !imageDisabled ? _onPressSelectImage : undefined,
            )}
            {renderToolbarButton(
              'PlayCircle',
              'post_toolbar.add_video',
              !videoDisabled ? _onPressSelectVideo : undefined,
            )}
            {renderToolbarButton(
              'Paperclip',
              'post_toolbar.add_file',
              !fileDisabled ? onPressAddFile : undefined,
            )}
          </View>
          {!!content && renderMarkdownHelp()}
          <KeyboardSpacer iosOnly />
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const renderMarkdownHelp = () => {
    return (
      <View style={styles.markdownView}>
        <Text.Subtitle style={styles.markdownText} numberOfLines={1}>
          **bold**, *italic*, ~~strike~~, # Heading 1, ## Heading 2,...
        </Text.Subtitle>
        <Text.Subtitle
          style={{fontFamily: 'OpenSans-SemiBold'}}
          color={theme.colors.link}
          onPress={onPressHelp}
          useI18n>
          common:text_help
        </Text.Subtitle>
      </View>
    );
  };

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      ContentComponent={<ReviewMarkdown onPressDone={closeModal} />}
      panGestureAnimatedValue={animated}
      modalStyle={styles.modalStyle}
      {...props}>
      {renderToolbar()}
    </BottomSheet>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    row: {flexDirection: 'row'},
    flex1: {flex: 1},
    toolbarStyle: {
      height: 52,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderDivider,
      paddingHorizontal: spacing?.padding.large,
      alignItems: 'center',
      flexDirection: 'row',
    },
    toolbarButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
    },
    contentContainer: {
      paddingHorizontal: spacing?.padding.base,
      paddingBottom: spacing?.padding.base,
    },
    markdownView: {
      flexDirection: 'row',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.base,
    },
    markdownText: {
      marginRight: spacing.margin.base,
      flex: 1,
    },
    modalStyle: {
      borderRadius: spacing.borderRadius.small,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
  });
};

export default PostToolbar;
