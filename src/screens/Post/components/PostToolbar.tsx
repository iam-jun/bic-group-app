import React, {useImperativeHandle, useRef, useState} from 'react';
import {
  Animated,
  Keyboard,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {throttle} from 'lodash';
import {useTheme} from 'react-native-paper';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {GestureEvent} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import {useDispatch} from 'react-redux';

import BottomSheet from '~/beinComponents/BottomSheet/index';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

import {ITheme} from '~/theme/interfaces';

import postActions from '~/screens/Post/redux/actions';
import {useBaseHook} from '~/hooks';

import ImagePicker from '~/beinComponents/ImagePicker';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {ICreatePostImage} from '~/interfaces/IPost';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import appConfig from '~/configs/appConfig';
import {showHideToastMessage} from '~/store/modal/actions';
import {checkPermission} from '~/utils/permission';
import {tryOpenURL} from '~/beinComponents/Markdown/utils/url.js';
import ReviewMarkdown from './ReviewMarkdown';
import {getChatDomain} from '~/utils/link';

export interface PostToolbarProps {
  toolbarRef?: any;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPressBack?: () => void;
  disabled?: boolean;
  imageDisabled?: boolean;
  videoDisabled?: boolean;
  fileDisabled?: boolean;
}

const PostToolbar = ({
  toolbarRef,
  style,
  containerStyle,
  onPressBack,
  imageDisabled,
  videoDisabled,
  fileDisabled,
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

  const onPressAddFile = () => {
    // TODO
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
    return (
      <View style={styles.toolbarButton}>
        <Icon
          size={20}
          tintColor={onPressIcon ? colors.iconTint : colors.textDisabled}
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
              'ImagePlus',
              'post_toolbar.add_photo',
              !imageDisabled ? _onPressSelectImage : undefined,
            )}
            {renderToolbarButton(
              'PlayCircle',
              'post_toolbar.add_video',
              !videoDisabled ? _onPressSelectVideo : undefined,
            )}
            {renderToolbarButton(
              'Link',
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
      side={'right'}
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
