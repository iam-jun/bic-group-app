import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty, throttle } from 'lodash';
import React, {
  FC, useImperativeHandle, useRef, useState,
} from 'react';
import {
  Animated,
  Keyboard,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useDispatch } from 'react-redux';
import BottomSheet from '~/baseComponents/BottomSheet/index';
import DocumentPicker from '~/beinComponents/DocumentPicker';
import ImagePicker from '~/beinComponents/ImagePicker';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import Text from '~/baseComponents/Text';
import appConfig from '~/configs/appConfig';
import { useKeySelector } from '~/hooks/selector';
import { ICreatePostImage } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';

import { Button } from '~/baseComponents';
import ReviewMarkdown from '~/screens/post/CreatePost/components/ReviewMarkdown';
import ToolbarButton from '~/components/posts/ToolbarButton';
import { getTotalFileSize } from '~/storeRedux/post/selectors';
import spacing from '~/theme/spacing';
import { getChatDomain, openInAppBrowser } from '~/utils/link';
import { checkPermission, permissionTypes } from '~/utils/permission';
import { clearExistingFiles, validateFilesPicker } from '../../helper';
import useUploadImage from '../../hooks/useUploadImage';

export interface PostToolbarProps {
  toolbarRef?: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  imageDisabled?: boolean;
  videoDisabled?: boolean;
  fileDisabled?: boolean;
  isSetting?:boolean;
  settingDisabled?: boolean;
  onPressBack?: () => void;
  onPressSetting: ()=> void;
}

const PostToolbar: FC<PostToolbarProps> = ({
  toolbarRef,
  style,
  containerStyle,
  imageDisabled,
  videoDisabled,
  fileDisabled,
  isSetting,
  settingDisabled,
  onPressBack,
  onPressSetting,
  ...props
}) => {
  const animated = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const modalizeRef = useRef<any>();

  const selectedImagesDraft: ICreatePostImage[] = useKeySelector(postKeySelector.createPost.imagesDraft) || [];
  const content = useKeySelector(postKeySelector.createPost.content);
  const selectedFiles = useKeySelector(postKeySelector.createPost.files);
  const { totalFiles, totalSize } = getTotalFileSize();

  const [isOpen, setIsOpen] = useState(false);

  const { handleImage } = useUploadImage();

  const iconSettingColor = getPostSettingIconColor({ settingDisabled, isSetting, theme });

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
    ImagePicker.openPickerMultiple({
      mediaType: 'photo',
      maxFiles: appConfig.postPhotoLimit,
    }).then((images) => {
      handleImage(images);
    });
  };

  const onPressAddFile = async () => {
    try {
      const files: any = await DocumentPicker.openPickerMultiple();
      const validFiles = validateFilesPicker(
        files,
        totalFiles,
        totalSize,
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
    openInAppBrowser(`${DOMAIN}/help/formatting`);
  };

  const renderToolbar = () => (
    <Animated.View style={containerStyle}>
      <View
        testID="post_toolbar"
        style={[styles.toolbarStyle, style]}
      >
        <View style={styles.row}>
          <ToolbarButton
            icon="Image"
            testID="post_toolbar.add_photo"
            onPressIcon={!imageDisabled ? _onPressSelectImage : undefined}
            shouldHighlight={selectedImagesDraft?.length > 0 && !imageDisabled}
          />
          <ToolbarButton
            icon="ClapperboardPlay"
            testID="post_toolbar.add_video"
            onPressIcon={!videoDisabled ? _onPressSelectVideo : undefined}
          />
          <ToolbarButton
            icon="Paperclip"
            testID="post_toolbar.add_file"
            onPressIcon={!fileDisabled ? onPressAddFile : undefined}
            shouldHighlight={selectedFiles?.length > 0 && !fileDisabled}
          />
          <ToolbarButton
            icon="Markdown"
            testID="post_toolbar.markdown_preview"
            onPressIcon={content && onPressMarkdownPreview}
          />
        </View>
        <Button.Raise
          size="medium"
          testID="header.menuIcon.button"
          icon="Sliders"
          disabled={settingDisabled}
          color={iconSettingColor}
          onPress={onPressSetting}
        />
      </View>
      {!!content && renderMarkdownHelp()}
      <KeyboardSpacer iosOnly />
    </Animated.View>
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

const getPostSettingIconColor = ({
  settingDisabled, isSetting, theme,
}: {
  settingDisabled: boolean, isSetting: boolean; theme: ExtendedTheme
}) => {
  if (settingDisabled) return theme.colors.neutral20;

  if (isSetting) return theme.colors.purple50;

  return theme.colors.neutral40;
};
