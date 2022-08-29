import { isEmpty, throttle } from 'lodash';
import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { GestureEvent } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import BottomSheet from '~/baseComponents/BottomSheet/index';
import DocumentPicker from '~/beinComponents/DocumentPicker';
import Icon from '~/baseComponents/Icon';
import ImagePicker from '~/beinComponents/ImagePicker';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import Text from '~/beinComponents/Text';
import appConfig from '~/configs/appConfig';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import { ICreatePostImage } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';
import { showHideToastMessage } from '~/storeRedux/modal/actions';

import spacing from '~/theme/spacing';
import { getChatDomain, openUrl } from '~/utils/link';
import { checkPermission, permissionTypes } from '~/utils/permission';
import { clearExistingFiles, validateFilesPicker } from '../CreatePost/helper';
import { getTotalFileSize } from '../../../storeRedux/post/selectors';
import ReviewMarkdown from './ReviewMarkdown';
import { Button } from '~/baseComponents';

export interface PostToolbarProps {
  toolbarRef?: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  imageDisabled?: boolean;
  videoDisabled?: boolean;
  fileDisabled?: boolean;
  onPressBack?: () => void;
  onPressSetting: ()=> void;
  isSetting?:boolean;
}

const PostToolbar = ({
  toolbarRef,
  style,
  containerStyle,
  imageDisabled,
  videoDisabled,
  fileDisabled,
  onPressBack,
  onPressSetting,
  isSetting,
  ...props
}: PostToolbarProps) => {
  const animated = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const modalizeRef = useRef<any>();

  const selectedImagesDraft: ICreatePostImage[] = useKeySelector(postKeySelector.createPost.imagesDraft) || [];
  const content = useKeySelector(postKeySelector.createPost.content);
  const selectedFiles = useKeySelector(postKeySelector.createPost.files);
  const { totalFiles, totalSize } = getTotalFileSize();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = throttle(
    (e?: any) => {
      Keyboard.dismiss();
      setIsOpen(true);
      modalizeRef?.current?.open?.(
        e?.pageX, e?.pageY,
      );
    }, 500,
  );

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

  useImperativeHandle(
    toolbarRef, () => ({
      openModal,
      closeModal,
      goBack,
    }),
  );

  const handleGesture = (event: GestureEvent<any>) => {
    const { nativeEvent } = event;
    if (nativeEvent.velocityY < 0) {
      openModal();
    }
  };

  const onPressMarkdownPreview = (e: any) => {
    openModal(e);
  };

  const _onPressSelectImage = () => {
    modalizeRef?.current?.close?.();
    checkPermission(
      permissionTypes.photo, dispatch, (canOpenPicker) => {
        if (canOpenPicker) {
          openGallery();
        }
      },
    );
  };

  const _onPressSelectVideo = () => {
    modalizeRef?.current?.close?.();
    checkPermission(
      permissionTypes.photo, dispatch, (canOpenPicker) => {
        if (canOpenPicker) {
          openSingleVideoPicker();
        }
      },
    );
  };

  const openSingleVideoPicker = () => {
    ImagePicker.openPickerSingle({ mediaType: 'video' })
      .then((selected) => {
        const data = selected;
        dispatch(postActions.setCreatePostVideo(data));
      })
      .catch((e) => {
        console.error(
          '\x1b[36m🐣️ openSingleVideoPicker error: \x1b[0m', e,
        );
      });
  };

  const openGallery = () => {
    ImagePicker.openPickerMultiple().then((images) => {
      const newImages: ICreatePostImage[] = [];
      images.forEach((item) => {
        newImages.push({ fileName: item.filename, file: item });
      });
      let newCurrentImages = [...selectedImagesDraft, ...newImages];
      if (newCurrentImages.length > appConfig.postPhotoLimit) {
        newCurrentImages = newCurrentImages.slice(
          0,
          appConfig.postPhotoLimit,
        );
        const errorContent = t('post:error_reach_upload_photo_limit').replace(
          '%LIMIT%', appConfig.postPhotoLimit,
        );
        dispatch(showHideToastMessage({
          content: errorContent,
          props: { textProps: { useI18n: true }, type: 'error' },
        }));
      }
      dispatch(postActions.setCreatePostImagesDraft(newCurrentImages));
      dispatch(postActions.setCreatePostImages(newCurrentImages));
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

      const newFiles = clearExistingFiles(
        selectedFiles, validFiles,
      );
      if (isEmpty(newFiles)) return;

      dispatch(postActions.addCreatePostFiles(newFiles));
    } catch (e) {
      console.error(
        '\x1b[36m🐣️ DocumentPicker.openPickerSingle error: \x1b[0m',
        e,
      );
    }
  };

  const onPressHelp = () => {
    const DOMAIN = getChatDomain();
    openUrl(`${DOMAIN}/help/formatting`);
  };

  const renderToolbarButton = (
    icon: any,
    testID: string,
    onPressIcon?: (e: any) => void,
    shouldHighlight?: boolean,
  ) => {
    const tintColor = !!shouldHighlight ? colors.purple50 : onPressIcon ? colors.neutral40 : colors.neutral20;

    return (
      <View style={styles.toolbarButton}>
        <Icon
          size={24}
          tintColor={tintColor}
          icon={icon}
          buttonTestID={testID}
          onPress={onPressIcon}
        />
      </View>
    );
  };

  const renderToolbar = () => (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <Animated.View style={containerStyle}>
        <View
          testID="post_toolbar"
          style={StyleSheet.flatten([styles.toolbarStyle, style])}
        >
          <View style={styles.row}>
            {renderToolbarButton(
              'Markdown',
              'post_toolbar.markdown_preview',
              content && onPressMarkdownPreview,
            )}
            {renderToolbarButton(
              'Image',
              'post_toolbar.add_photo',
              !imageDisabled ? _onPressSelectImage : undefined,
              selectedImagesDraft?.length > 0 && !imageDisabled,
            )}
            {renderToolbarButton(
              'ClapperboardPlay',
              'post_toolbar.add_video',
              !videoDisabled ? _onPressSelectVideo : undefined,
            )}
            {renderToolbarButton(
              'Paperclip',
              'post_toolbar.add_file',
              !fileDisabled ? onPressAddFile : undefined,
              selectedFiles?.length > 0 && !fileDisabled,
            )}
          </View>
          <Button.Raise
            size="medium"
            testID="header.menuIcon.button"
            icon="Sliders"
            color={isSetting ? colors.purple50 : colors.neutral40}
            onPress={onPressSetting}
          />
        </View>
        {!!content && renderMarkdownHelp()}
        <KeyboardSpacer iosOnly />
      </Animated.View>
    </PanGestureHandler>
  );

  const renderMarkdownHelp = () => (
    <View style={styles.markdownView}>
      <Text.BodyXS color={theme.colors.neutral40} style={styles.markdownText} numberOfLines={1}>
        **bold**, *italic*, ~~strike~~, # Heading 1, ## Heading 2,...
      </Text.BodyXS>
      <Text.BodyXSMedium
        color={theme.colors.blue50}
        onPress={onPressHelp}
        useI18n
      >
        common:text_help
      </Text.BodyXSMedium>
    </View>
  );

  return (
    <BottomSheet
      modalizeRef={modalizeRef}
      ContentComponent={<ReviewMarkdown onPressDone={closeModal} />}
      panGestureAnimatedValue={animated}
      {...props}
    >
      {renderToolbar()}
    </BottomSheet>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    row: { flexDirection: 'row' },
    flex1: { flex: 1 },
    toolbarStyle: {
      height: 52,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral5,
      paddingHorizontal: spacing.padding.large,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',

    },
    toolbarButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
    },
    contentContainer: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
    },
    markdownView: {
      flexDirection: 'row',
      marginHorizontal: spacing.margin.small,
      marginVertical: spacing.margin.tiny,
    },
    markdownText: {
      marginRight: spacing.margin.base,
      flex: 1,
    },
  });
};

export default PostToolbar;
