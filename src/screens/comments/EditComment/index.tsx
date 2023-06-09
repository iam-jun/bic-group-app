import React, {
  FC, useRef, useEffect, useCallback,
} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text as RNText,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import { useBaseHook } from '~/hooks';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { fontFamilies } from '~/theme/fonts';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import UploadingImage from '~/beinComponents/UploadingImage';
import dimension from '~/theme/dimension';
import { IGiphy } from '~/interfaces/IGiphy';
import CommentToolbar from '../components/CommentToolbar';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import StickerView from '~/components/StickerView';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import LoadingComment from './LoadingComment';
import useEditComment from './useEditComment';
import GifView from '~/components/GiphyView';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import spacing from '~/theme/spacing';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import PostInput from '~/beinComponents/inputs/PostInput';

const inputMinHeight = 66;
const isAndroid8 = Platform.OS === 'android' && parseInt(
  DeviceInfo.getSystemVersion(), 10,
) === 8;
const isAnimated = isAndroid8;

export interface EditCommentProps {
  route?: {
    params?: {
      commentId?: string;
      groupIds?: string;
    };
  };
}

const EditComment: FC<EditCommentProps> = ({ route }: EditCommentProps) => {
  const inputHeightAnim = new Animated.Value(inputMinHeight);

  const mentionInputRef = useRef<any>();
  const refTextInput = useRef<any>();

  const emojiViewRef = useRef<any>();
  const giphyViewRef = useRef<any>();
  const cursorPosition = useRef(0);

  const { commentId, groupIds } = route?.params || {};
  const {
    contentLoading,
    selectedImage,
    disableButton,
    content,
    giphy,
    disableImageOption,
    disableGifOption,
    handelSelectImage,
    handleUploadImageSuccess,
    handleRemoveImage,
    onPasteImage,
    handleContentChange,
    handleSelectGiphy,
    handleRemoveGiphy,
    handleSelectEmoij,
    handleSave,
    handleBack,
  } = useEditComment({ commentId, mentionInputRef });

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    emojiViewRef?.current?.hide?.();
    refTextInput?.current?.setFocus?.();
    refTextInput?.current?.setClear?.();
  }, []);

  const onSelectionChange = (event: any) => {
    const position = event.nativeEvent.selection.end;
    cursorPosition.current = position;
  };

  const onEmojiSelected = useCallback((emoji: string) => {
    emojiViewRef?.current?.hide?.();
    handleSelectEmoij(emoji, cursorPosition.current);
    refTextInput?.current?.setFocus?.();
  }, []);

  const onGiphySelected = useCallback((gif: IGiphy) => {
    giphyViewRef?.current?.hide?.();
    handleSelectGiphy(gif);
  }, []);

  const onSelectEmoij = () => {
    giphyViewRef?.current?.hide?.();
    emojiViewRef?.current?.show?.('emoji');
  };

  const onSelectGif = () => {
    Keyboard.dismiss();
    emojiViewRef?.current?.hide?.();
    giphyViewRef?.current?.show?.('giphy');
  };

  const onFocus = () => {
    giphyViewRef?.current?.hide?.();
    emojiViewRef?.current?.hide?.();
  };

  const onLayoutCloneText = (e: any) => {
    const height = e?.nativeEvent?.layout?.height;
    let newHeight = Math.max(
      inputMinHeight, height,
    );
    if (isAndroid8) {
      // Avoid bug white screen on android 8
      newHeight = Math.min(
        500, newHeight,
      );
    }
    Animated.timing(
      inputHeightAnim, {
        toValue: newHeight,
        useNativeDriver: false,
        duration: 0,
        easing: Easing.ease,
      },
    ).start();
  };

  const onPressInput = () => refTextInput?.current?.setFocus?.();

  const renderImage = () => {
    if (!selectedImage) {
      return null;
    }
    const { file, fileName, url } = selectedImage;
    const { width = 1, height = 1 } = file || {};
    const ratio = height / width;
    const dfWidth = Math.min(
      dimension.deviceWidth, dimension.maxNewsfeedWidth,
    );

    return (
      <UploadingImage
        uploadType={ResourceUploadType.commentContent}
        style={{ alignSelf: 'center' }}
        file={file}
        fileName={fileName}
        url={url}
        width={dfWidth}
        height={dfWidth * ratio}
        onUploadSuccess={handleUploadImageSuccess}
        onPressRemove={handleRemoveImage}
      />
    );
  };

  const renderGiphy = () => {
    if (!giphy) return null;
    return (
      <View testID="edit_comment_screen.giphy">
        <Button
          style={styles.icRemove}
          onPress={handleRemoveGiphy}
          hitSlop={{
            top: 10, bottom: 10, right: 10, left: 10,
          }}
          testID="edit_comment_screen.giphy.close_button"
        >
          <Icon
            size={12}
            icon="iconCloseSmall"
          />
        </Button>
        <GifView style={styles.gifView} giphy={giphy as any} />
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white}>
      <Header
        titleTextProps={{ useI18n: true }}
        title="post:title_edit_comment"
        buttonText="common:btn_save"
        buttonProps={{
          disabled: disableButton,
          useI18n: true,
          style: { borderWidth: 0 },
        }}
        onPressBack={handleBack}
        onPressButton={handleSave}
      />
      <View style={styles.flex1}>
        {contentLoading && <LoadingComment />}
        {isAnimated && (
        <View style={styles.textCloneContainer}>
          <RNText style={styles.textContentClone} onLayout={onLayoutCloneText}>
            {`${content}\njust invisible line`}
          </RNText>
        </View>
        )}
        <TouchableOpacity
          style={styles.flex1}
          activeOpacity={1}
          onPress={onPressInput}
          testID="edit_comment_screen.input_view"
        >
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                height: isAnimated ? inputHeightAnim : undefined,
              }}
            >
              <MentionInput
                groupIds={groupIds || ''}
                disableAutoComplete
                style={styles.flex1}
                textInputStyle={styles.flex1}
                mentionInputRef={mentionInputRef}
                ComponentInput={PostInput}
                componentInputProps={{
                  value: content,
                  isHandleUpload: true,
                  scrollEnabled: false,
                  inputRef: refTextInput,
                  modalStyle: styles.mentionInputModal,
                  placeholder: t('post:placeholder_write_comment'),
                  onChangeText: handleContentChange,
                  onFocus,
                  onPasteImage,
                }}
                onSelectionChange={onSelectionChange}
                autocompleteProps={{
                  modalPosition: 'bottom',
                  title: t('post:mention_title'),
                  emptyContent: t('post:mention_empty_content'),
                  showShadow: true,
                  modalStyle: { maxHeight: 350 },
                }}
              />
            </Animated.View>
            {renderImage()}
            {renderGiphy()}
          </Animated.ScrollView>
        </TouchableOpacity>
        <CommentToolbar
          disableImageOption={disableImageOption}
          disableGifOption={disableGifOption}
          onSelectImage={handelSelectImage}
          onSelectGif={onSelectGif}
          onSelectEmoij={onSelectEmoij}
        />
        <MentionBar style={styles.mentionBarStyle} />
        <StickerView
          stickerViewRef={emojiViewRef}
          onEmojiSelected={onEmojiSelected}
        />
        <StickerView
          stickerViewRef={giphyViewRef}
          onGiphySelected={onGiphySelected}
        />
        <KeyboardSpacer iosOnly />
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    flex1: { flex: 1 },
    mentionInputModal: {
      position: undefined,
      top: undefined,
      bottom: undefined,
      marginTop: -12,
      maxHeight: 180,
    },
    textContentClone: {
      position: 'absolute',
      top: 13,
      left: 12,
      right: 12,
      opacity: 1,
      fontSize: dimension?.sizes.bodyM,
      fontFamily: fontFamilies.BeVietnamProLight,
      color: colors.success,
    },
    textCloneContainer: {
      height: 0,
      overflow: 'hidden',
    },
    mentionBarStyle: {
      borderTopColor: colors.neutral5,
    },
    icRemove: {
      position: 'absolute',
      top: spacing.margin.small,
      right: spacing.margin.small,
      width: 20,
      height: 20,
      borderRadius: spacing.borderRadius.circle,
      backgroundColor: colors.neutral2,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.neutral80,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
      zIndex: 2,
    },
    gifView: {
      zIndex: 1,
    },
  });
};

export default EditComment;
