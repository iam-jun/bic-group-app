import { GiphyMediaView } from '@giphy/react-native-sdk';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Keyboard,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputSelectionChangeEventData,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import PasteInput from 'react-native-paste-image-input';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import Image from '~/beinComponents/Image';
import ImagePicker from '~/beinComponents/ImagePicker';
import CommentInputFooter from '~/beinComponents/inputs/CommentInput/CommentInputFooter';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import StickerView from '~/components/StickerView';
import Text from '~/baseComponents/Text';
import { IUploadType, uploadTypes } from '~/configs/resourceConfig';
import { useBaseHook } from '~/hooks';
import { IFilePicked } from '~/interfaces/common';
import { IActivityDataImage } from '~/interfaces/IPost';
import ImageUploader, { IGetFile } from '~/services/imageUploader';
import modalActions from '~/storeRedux/modal/actions';
import dimension from '~/theme/dimension';
import { fontFamilies } from '~/theme/fonts';
import spacing from '~/theme/spacing';
import { checkPermission, permissionTypes } from '~/utils/permission';
import { formatTextWithEmoji } from '~/utils/emojiUtils';
import { IGiphy } from '~/interfaces/IGiphy';
import { getImagePastedFromClipboard } from '~/utils/common';

export interface ICommentInputSendParam {
  content: string;
  image?: IActivityDataImage;
  giphy?: IGiphy;
}

export interface CommentInputProps {
  useTestID?: boolean;
  commentInputRef?: any;
  style?: StyleProp<ViewStyle>;
  value?: string; // work only on init, not handle change
  placeholder?: string;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  textInputRef?: any;
  loading?: boolean;
  isHandleUpload?: boolean;
  clearWhenUploadDone?: boolean;
  uploadImageType?: IUploadType;
  uploadVideoType?: IUploadType;
  uploadFileType?: IUploadType;
  uploadFilePromise?: any;
  disableKeyboardSpacer?: boolean;
  HeaderComponent?: React.ReactNode;

  onChangeText?: (text: string) => void;
  onPressSend?: (data?: ICommentInputSendParam) => void;
  onPressSelectImage?: (file: IFilePicked) => void;
  onPressFile?: (file: IFilePicked) => void;
  onContentSizeChange?: (event: any) => void;
  onSelectionChange?:
    | ((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void)
    | undefined;
  onKeyPress?: (e: any) => void;
}

const DEFAULT_HEIGHT = 44;
const LIMIT_HEIGHT = 100;

const CommentInput: React.FC<CommentInputProps> = ({
  commentInputRef,
  useTestID = true,
  style,
  value,
  placeholder = 'Aa',
  autoFocus,
  blurOnSubmit,
  HeaderComponent,
  textInputRef,
  loading = false,
  isHandleUpload,
  clearWhenUploadDone,
  uploadImageType = uploadTypes.commentImage,
  uploadFilePromise,
  disableKeyboardSpacer,

  onChangeText,
  onPressSend,
  onPressSelectImage,
  onSelectionChange,
  onKeyPress,
  onContentSizeChange,
  ...props
}: CommentInputProps) => {
  const testID = useTestID ? 'comment_input' : undefined;
  const [text, setText] = useState<string>(value || '');

  const [textTextInputHeight, setTextInputHeight] = useState(DEFAULT_HEIGHT);
  const heightAnimated = useRef(new Animated.Value(DEFAULT_HEIGHT)).current;
  const cursorPosition = useRef(0);

  const handleSetTextInputHeight = (newHeight: number) => {
    if (newHeight === textTextInputHeight) return;

    setTextInputHeight(newHeight);
    Animated.timing(heightAnimated, {
      toValue: newHeight,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const [selectedImage, setSelectedImage] = useState<IFilePicked>();
  const [selectedGiphy, setSelectedGiphy] = useState<IGiphy>();
  const [selectedEmoji, setSelectedEmoji] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const emojiViewRef = useRef<any>();
  const giphyViewRef = useRef<any>();
  const _textInputRef = textInputRef || useRef();

  const _loading = loading || uploading;

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets, _loading);

  useEffect(() => {
    if (selectedGiphy) {
      if (text) {
        focus();
      } else {
        _onPressSend();
      }
    }
  }, [selectedGiphy]);

  useEffect(() => {
    emojiViewRef?.current?.hide?.();
    if (selectedEmoji) {
      const completeStr = formatTextWithEmoji(text, selectedEmoji, cursorPosition.current);
      setText(completeStr);
      onChangeText?.(completeStr);
      setSelectedEmoji('');
      _textInputRef.current.focus();
    }
  }, [selectedEmoji]);

  const _onPressSelectImage = () => {
    checkPermission(permissionTypes.photo, dispatch, (canOpenPicker) => {
      if (canOpenPicker) {
        ImagePicker.openPickerSingle().then((file) => {
          if (!file) return;
          setSelectedGiphy(undefined);
          if (!isHandleUpload) {
            onPressSelectImage?.(file);
          } else {
            setUploadError('');
            setSelectedImage(file);
          }
          focus();
        });
      }
    });
  };

  const _onPressFile = async () => {
    // const file: any = await DocumentPicker.openPickerSingle();
    // onPressFile?.(file);
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressCamera = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressEmoji = () => {
    emojiViewRef?.current?.hide?.();
    giphyViewRef?.current?.show?.('giphy');
  };

  const onEmojiSelected = useCallback((emoji: string) => {
    setSelectedEmoji(emoji);
  }, []);

  const onGiphySelected = useCallback((gif: IGiphy) => {
    giphyViewRef?.current?.hide?.();

    setSelectedImage(undefined);
    setSelectedGiphy(gif);
  }, []);

  const onPressIcon = () => {
    // dispatch(modalActions.setShowReactionBottomSheet(
    //   { visible: true, callback: onEmojiSelected },
    // ));
    giphyViewRef?.current?.hide?.();
    emojiViewRef?.current?.show?.('emoji');
  };

  const handleUpload = () => {
    if (selectedImage) {
      setUploading(true);
      const param = {
        file: selectedImage,
        uploadType: uploadImageType,
      };
      const promise = uploadFilePromise
        ? uploadFilePromise({ ...param, text })
        : ImageUploader.getInstance().upload(param);
      promise
        .then((result: IGetFile) => {
          setUploading(false);
          const imageData: IActivityDataImage = {
            id: result?.result?.id,
            name: result?.url || '',
            origin_name: selectedImage.filename,
            width: selectedImage.width,
            height: selectedImage.height,
          };
          !clearWhenUploadDone
            && onPressSend?.({ content: text, image: imageData });
          clearWhenUploadDone && clear();
        })
        .catch((e: any) => {
          console.error('\x1b[31m🐣️ CommentInput upload Error:', e, '\x1b[0m');
          const errorMessage
            = typeof e === 'string'
              ? e
              : e?.meta?.message || t('post:error_upload_photo_failed');
          setUploading(false);
          setUploadError(errorMessage);
        });
    } else {
      onPressSend?.({ content: text });
    }
  };

  const _onPressSend = () => {
    if (!_loading) {
      blurOnSubmit && Keyboard.dismiss();
      if (selectedGiphy) {
        onPressSend?.({
          content: text,
          giphy: {
            id: selectedGiphy.id,
            type: selectedGiphy.type,
          },
        });
        setSelectedGiphy(undefined);
      } else if (!isHandleUpload) {
        onPressSend?.({ content: text });
      } else {
        handleUpload();
      }
      setText('');
    }
  };

  const _onFocus = () => {
    giphyViewRef?.current?.hide?.();
    emojiViewRef?.current?.hide?.();
  };

  const _onChangeText = (value: string) => {
    setText(value);
    onChangeText?.(value);
  };

  const _onSelectionChange = (event: any) => {
    const position = event.nativeEvent.selection.end;
    cursorPosition.current = position;
    onSelectionChange?.(event);
  };

  const calculateTextInputHeight = (height: number) => {
    let newHeight = Math.min(Math.max(DEFAULT_HEIGHT, height), LIMIT_HEIGHT);
    if (value?.length === 0) {
      newHeight = DEFAULT_HEIGHT;
    }
    return newHeight;
  };

  const _onContentSizeChange = (e: any) => {
    onContentSizeChange?.(e);

    const newHeight = calculateTextInputHeight(
      e.nativeEvent.contentSize.height,
    );

    handleSetTextInputHeight(newHeight);
  };

  const getText = () => text;

  const hasMedia = () => selectedImage || selectedGiphy;

  const clear = () => {
    setText('');
    setUploadError('');
    setUploading(false);
    setSelectedImage(undefined);
    setSelectedGiphy(undefined);
    onChangeText?.('');
  };

  const focus = () => {
    _textInputRef.current?.focus?.();
  };

  const isFocused = () => _textInputRef.current?.isFocused?.();

  const send = () => _onPressSend();

  const onBackPress = () => {
    emojiViewRef?.current?.onBackPress?.();
    giphyViewRef?.current?.onBackPress?.();
  };

  useImperativeHandle(commentInputRef, () => ({
    setText,
    getText,
    hasMedia,
    clear,
    focus,
    isFocused,
    send,
    onBackPress,
  }));

  const _onKeyPress = (e: any) => {
    onKeyPress?.(e);
  };

  // only support for iOS
  const onPasteImage = (_, files) => {
    const img = getImagePastedFromClipboard(files);
    if (img) {
      setSelectedImage({
        name: img.fileName,
        filename: img.fileName,
        type: img.type,
        size: img.fileSize,
        uri: img.uri,
      });
    }
  };

  const renderSelectedMedia = () => {
    if (selectedGiphy) {
      if (!text) return null;

      return (
        <View style={{ backgroundColor: colors.white }}>
          <View style={styles.selectedImageWrapper}>
            <View style={styles.selectedImageContainer}>
              <GiphyMediaView
                media={selectedGiphy}
                style={styles.selectedImage}
              />
            </View>
            <Button
              style={styles.iconCloseSelectedImage}
              onPress={() => setSelectedGiphy(undefined)}
            >
              <Icon size={12} icon="iconCloseSmall" />
            </Button>
          </View>
        </View>
      );
    }
    if (!selectedImage || !isHandleUpload) {
      return null;
    }
    return (
      <View style={{ backgroundColor: colors.white }}>
        {!!uploadError && (
          <View style={styles.selectedImageErrorContainer}>
            <Text color={colors.red60}>
              <Text color={colors.red60}>{uploadError}</Text>
              <Text color={colors.red60}>
                {' • '}
                <Text.BodyM useI18n color={colors.red60} onPress={handleUpload}>
                  common:text_retry
                </Text.BodyM>
              </Text>
            </Text>
          </View>
        )}
        <View style={styles.selectedImageWrapper}>
          <View style={styles.selectedImageContainer}>
            <Image
              style={styles.selectedImage}
              source={
                selectedImage?.uri
                  ? { uri: selectedImage?.uri }
                  : selectedImage?.base64
              }
            />
            {(_loading || !!uploadError) && (
              <View
                style={[
                  styles.selectedImageFilter,
                  { borderWidth: uploadError ? 1 : 0 },
                ]}
              >
                {_loading && <LoadingIndicator />}
              </View>
            )}
          </View>
          <Button
            style={styles.iconCloseSelectedImage}
            onPress={() => setSelectedImage(undefined)}
          >
            <Icon size={12} icon="iconCloseSmall" />
          </Button>
        </View>
      </View>
    );
  };

  const disabledBtnSend = _loading || (!text.trim() && !hasMedia());
  const isHideBtnSend = !loading && !text.trim() && !hasMedia();

  return (
    <View>
      <View style={[styles.root, style]}>
        {HeaderComponent}
        <View style={styles.container}>
          <Animated.View style={{ flex: 1, zIndex: 1, height: heightAnimated }}>
            <PasteInput
              {...props}
              multiline
              testID={testID}
              ref={_textInputRef}
              autoFocus={autoFocus}
              editable={!_loading}
              placeholder={placeholder}
              style={styles.textInput}
              selectionColor={colors.gray50}
              placeholderTextColor={colors.gray50}
              onFocus={_onFocus}
              onKeyPress={_onKeyPress}
              onChangeText={_onChangeText}
              onSelectionChange={_onSelectionChange}
              onContentSizeChange={_onContentSizeChange}
              onPaste={onPasteImage}
              value={text}
            />
          </Animated.View>
          <CommentInputFooter
            useTestID={useTestID}
            loading={_loading}
            disabledBtnSend={disabledBtnSend}
            isHideBtnSend={isHideBtnSend}
            isDisplayNone={text.trim().length !== 0}
            onPressIcon={onPressIcon}
            onPressFile={_onPressFile}
            onPressImage={_onPressSelectImage}
            onPressCamera={onPressCamera}
            onPressEmoji={onPressEmoji}
            onPressSend={_onPressSend}
          />
        </View>
        {renderSelectedMedia()}
        <CommentInputFooter
          useTestID={useTestID}
          loading={_loading}
          isHideBtnSend={false}
          isDisplayNone={text.trim().length === 0}
          disabledBtnSend={disabledBtnSend}
          onPressIcon={onPressIcon}
          onPressFile={_onPressFile}
          onPressImage={_onPressSelectImage}
          onPressCamera={onPressCamera}
          onPressEmoji={onPressEmoji}
          onPressSend={_onPressSend}
        />
      </View>
      <StickerView
        stickerViewRef={emojiViewRef}
        onEmojiSelected={onEmojiSelected}
      />
      <StickerView
        stickerViewRef={giphyViewRef}
        onGiphySelected={onGiphySelected}
      />
      {disableKeyboardSpacer !== false && <KeyboardSpacer iosOnly />}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: any, loading: boolean) => {
  const { colors } = theme;
  return StyleSheet.create({
    root: {
      borderTopWidth: 1,
      borderColor: colors.neutral5,
      backgroundColor: colors.white,
      paddingBottom: spacing.padding.small,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 24,
      height: 24,
      marginRight: spacing.margin.small,
      borderRadius: 12,
      backgroundColor: theme.colors.purple60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      width: '100%',
      lineHeight: 22,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      color: loading ? colors.gray50 : colors.neutral80,
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension?.sizes.bodyM,
    },
    iconSend: {
      marginBottom: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
    },
    loadingContainer: {
      marginBottom: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
    },
    buttonEmoji: { position: 'absolute', right: 10, bottom: 10 },
    selectedImageWrapper: {
      alignSelf: 'flex-start',
      marginHorizontal: spacing.margin.small,
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.tiny,
    },
    selectedImageContainer: {
      borderRadius: spacing.borderRadius.small,
      overflow: 'hidden',
    },
    selectedImage: { width: 64, height: 64 },
    iconCloseSelectedImage: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.neutral80,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    selectedImageFilter: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.red60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedImageErrorContainer: {
      flexDirection: 'row',
      marginTop: spacing.margin.tiny,
      marginHorizontal: spacing.margin.base,
      paddingBottom: spacing.margin.tiny,
    },
  });
};

export default CommentInput;
