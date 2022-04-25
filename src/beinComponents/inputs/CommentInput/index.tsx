import React, {useEffect, useRef, useState, useImperativeHandle} from 'react';
import {
  Animated,
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';
import ImagePicker from '~/beinComponents/ImagePicker';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import {IFilePicked} from '~/interfaces/common';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';
import Button from '~/beinComponents/Button';
import {IUploadType, uploadTypes} from '~/configs/resourceConfig';
import Image from '~/beinComponents/Image';
import FileUploader, {IGetFile} from '~/services/fileUploader';
import {IActivityDataImage} from '~/interfaces/IPost';
import {useBaseHook} from '~/hooks';
import {useDispatch} from 'react-redux';
import Text from '~/beinComponents/Text';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import EmojiBoardAnimated from '~/beinComponents/emoji/EmojiBoardAnimated';
import modalActions from '~/store/modal/actions';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommentInputFooter from '~/beinComponents/inputs/CommentInput/CommentInputFooter';
import {checkPermission} from '~/utils/permission';

export interface ICommentInputSendParam {
  content: string;
  image?: IActivityDataImage;
}

export interface CommentInputProps {
  commentInputRef?: any;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPressSend?: (data?: ICommentInputSendParam) => void;
  onPressSelectImage?: (file: IFilePicked) => void;
  onPressFile?: (file: IFilePicked) => void;
  onSelectionChange?:
    | ((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void)
    | undefined;
  onKeyPress?: (e: any) => void;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  value?: string; //work only on init, not handle change
  HeaderComponent?: React.ReactNode;
  textInputRef?: any;
  loading?: boolean;
  disableKeyboardSpacer?: boolean;
  onContentSizeChange?: (event: any) => void;
  isHandleUpload?: boolean;
  clearWhenUploadDone?: boolean;
  uploadImageType?: IUploadType;
  uploadVideoType?: IUploadType;
  uploadFileType?: IUploadType;
  uploadFilePromise?: any;
  useTestID?: boolean;
}

const DEFAULT_HEIGHT = 44;
const LIMIT_HEIGHT = 100;

const CommentInput: React.FC<CommentInputProps> = ({
  commentInputRef,
  style,
  placeholder = 'Aa',
  onChangeText,
  onPressSend,
  onPressSelectImage,
  onPressFile,
  onSelectionChange,
  onKeyPress,
  autoFocus,
  blurOnSubmit,
  value,
  HeaderComponent,
  textInputRef,
  loading = false,
  disableKeyboardSpacer,
  onContentSizeChange,
  isHandleUpload,
  clearWhenUploadDone,
  uploadImageType = uploadTypes.commentImage,
  uploadVideoType = uploadTypes.commentVideo,
  uploadFileType = uploadTypes.commentFile,
  uploadFilePromise,
  useTestID = true,
  ...props
}: CommentInputProps) => {
  const [text, setText] = useState<string>(value || '');
  const [cloneTextForWeb, setCloneTextForWeb] = useState<string>(value || '');
  const [selection, setSelection] = useState<{start: number; end: number}>();
  const [addToEnd, setAddToEnd] = useState(true);

  const [textTextInputHeight, setTextInputHeight] = useState(DEFAULT_HEIGHT);
  const heightAnimated = useRef(new Animated.Value(DEFAULT_HEIGHT)).current;

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const emojiBoardRef = useRef<any>();
  const _textInputRef = textInputRef || useRef();

  const _loading = loading || uploading;

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets, _loading);
  const [inputSelection, setInputSelection] = useState<any>();
  const supportedMarkdownKey = {
    b: '**',
    i: '*',
  };
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    /**
     * Clone text in order to handling empty newline
     * as the <Text> does not adding the height of
     * the empty newline by its own
     */
    if (isWeb) {
      const lastChar = text.substr(text.length - 1);
      const isEmptyNewline = lastChar === '\n';

      if (isEmptyNewline) setCloneTextForWeb(text + '.');
      else setCloneTextForWeb(text);
    }
  }, [text, selectedImage]);

  const _onPressSelectImage = () => {
    checkPermission('photo', dispatch, canOpenPicker => {
      if (canOpenPicker) {
        ImagePicker.openPickerSingle().then(file => {
          if (!file) return;
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

  const onPressCamera = (event: any) => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressEmoji = (event: any) => {
    if (!isWeb) {
      emojiBoardRef?.current?.show?.();
    } else {
      dispatch(
        modalActions.showModal({
          isOpen: true,
          ContentComponent: (
            <EmojiBoard
              width={320}
              height={280}
              onEmojiSelected={onEmojiSelected}
            />
          ),
          props: {
            webModalStyle: {minHeight: undefined},
            isContextMenu: true,
            position: {x: event?.pageX, y: event?.pageY},
          },
        }),
      );
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      console.log(`\x1b[36m🐣️ CommentInput handleUpload upload now\x1b[0m`);
      setUploading(true);
      const param = {
        file: selectedImage,
        uploadType: uploadImageType,
      };
      const promise = uploadFilePromise
        ? uploadFilePromise({...param, text})
        : FileUploader.getInstance().upload(param);
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
          !clearWhenUploadDone &&
            onPressSend?.({content: text, image: imageData});
          clearWhenUploadDone && clear();
        })
        .catch((e: any) => {
          console.log(`\x1b[31m🐣️ CommentInput upload Error:`, e, `\x1b[0m`);
          const errorMessage =
            typeof e === 'string'
              ? e
              : e?.meta?.message || t('post:error_upload_photo_failed');
          setUploading(false);
          setUploadError(errorMessage);
        });
    } else {
      onPressSend?.({content: text});
    }
  };

  const _onPressSend = () => {
    if (!_loading) {
      blurOnSubmit && Keyboard.dismiss();
      if (!isHandleUpload) {
        onPressSend?.({content: text});
      } else {
        handleUpload();
      }
    }
  };

  const _onFocus = () => {
    emojiBoardRef?.current?.hide?.();
  };

  const _onChangeText = (value: string) => {
    setText(value);
    onChangeText?.(value);
  };

  const _onSelectionChange = (event: any) => {
    setSelection(event.nativeEvent.selection);
    onSelectionChange?.(event);
    if (selection?.end === text?.length - 1) {
      setAddToEnd(true);
    } else {
      setAddToEnd(false);
    }
    Platform.OS === 'web' && setInputSelection(event.nativeEvent.selection);
  };

  const addTextToCursor = (newText: string) => {
    if (selection?.end && !addToEnd) {
      _onChangeText(
        `${text.slice(0, selection.end)}${newText}${text.slice(selection.end)}`,
      );
    } else {
      _onChangeText(`${text}${newText}`);
    }
  };

  const backSpaceFromCursor = () => {
    if (selection?.end && !addToEnd) {
      _onChangeText(
        `${text.slice(0, selection.end - 1)}${text.slice(selection.end)}`,
      );
    } else {
      if (text?.length > 0) {
        _onChangeText(`${text.slice(0, text.length - 1)}`);
      }
    }
  };

  const onEmojiSelected = (emoji: string) => {
    if (isWeb) {
      dispatch(modalActions.hideModal());
    }
    addTextToCursor(emoji);
  };

  const handleKeyEvent = (event: any) => {
    if (
      (event.metaKey || event.ctrlKey) &&
      Object.keys(supportedMarkdownKey).includes(event.key)
    ) {
      //@ts-ignore
      const format = supportedMarkdownKey[event.key];
      if (inputSelection) {
        const {start, end} = inputSelection;
        if (end - start > 0) {
          const formattedText = `${format}${text}${format}`;
          _onChangeText(formattedText);
        } else {
          const _text = text;
          const formattedText = `${_text}${format}${format}`;

          _onChangeText(formattedText);
          setInputSelection({
            start: _text.length + format.length,
            end: _text.length + format.length,
          });
        }
      }
    }
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

    if (isWeb) return;
    const newHeight = calculateTextInputHeight(
      e.nativeEvent.contentSize.height,
    );

    handleSetTextInputHeight(newHeight);
  };

  const _onLayout = (e: any) => {
    const newHeight = calculateTextInputHeight(e.nativeEvent.layout.height);

    handleSetTextInputHeight(newHeight);
  };

  const getText = () => text;

  const getSelectedImage = () => selectedImage;

  const clear = () => {
    setText('');
    setUploadError('');
    setUploading(false);
    setSelectedImage(undefined);
    onChangeText?.('');
  };

  const focus = () => _textInputRef.current?.focus?.();

  const isFocused = () => _textInputRef.current?.isFocused?.();

  const send = () => _onPressSend();

  useImperativeHandle(commentInputRef, () => ({
    setText,
    getText,
    getSelectedImage,
    clear,
    focus,
    isFocused,
    send,
  }));

  const _onKeyPress = (e: any) => {
    onKeyPress?.(e);
    if (Platform.OS === 'web') {
      handleKeyEvent(e);
    }
  };

  const inputStyle: any = StyleSheet.flatten([
    styles.textInput,
    Platform.OS === 'web' ? {outlineWidth: 0, height: textTextInputHeight} : {},
  ]);

  const renderSelectedImage = () => {
    if (!selectedImage || !isHandleUpload) {
      return null;
    }
    return (
      <View style={{backgroundColor: colors.background}}>
        {!!uploadError && (
          <View style={styles.selectedImageErrorContainer}>
            <Text color={colors.error}>
              <Text color={colors.error}>{uploadError}</Text>
              <Text color={colors.error}>
                {' • '}
                <Text.BodyM useI18n color={colors.error} onPress={handleUpload}>
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
                  ? {uri: selectedImage?.uri}
                  : selectedImage?.base64
              }
            />
            {(_loading || !!uploadError) && (
              <View
                style={[
                  styles.selectedImageFilter,
                  {borderWidth: uploadError ? 1 : 0},
                ]}>
                {_loading && <LoadingIndicator />}
              </View>
            )}
          </View>
          <Button
            style={styles.iconCloseSelectedImage}
            onPress={() => setSelectedImage(undefined)}>
            <Icon size={12} icon={'iconCloseSmall'} />
          </Button>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={[styles.root, style]}>
        {HeaderComponent}
        <View style={styles.container}>
          <Animated.View style={{flex: 1, zIndex: 1, height: heightAnimated}}>
            <TextInput
              selection={inputSelection}
              {...props}
              testID={useTestID ? 'comment_input' : undefined}
              onContentSizeChange={_onContentSizeChange}
              ref={_textInputRef}
              style={inputStyle}
              selectionColor={colors.textSecondary}
              multiline={true}
              autoFocus={autoFocus}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              editable={!_loading}
              value={Platform.OS === 'web' ? value : undefined}
              onFocus={_onFocus}
              onChangeText={_onChangeText}
              onSelectionChange={_onSelectionChange}
              onKeyPress={_onKeyPress}>
              {Platform.OS !== 'web' && text}
            </TextInput>
            {isWeb && (
              /**
               * Add duplicated Text on web to handle changing
               * content size more precisely
               */
              <Text
                nativeID="lol-text"
                onLayout={_onLayout}
                style={[styles.textInput, styles.textDuplicatedOnWeb]}>
                {cloneTextForWeb || placeholder}
              </Text>
            )}
          </Animated.View>
        </View>
        {renderSelectedImage()}
        <CommentInputFooter
          useTestID={useTestID}
          onPressFile={_onPressFile}
          onPressImage={_onPressSelectImage}
          onPressCamera={onPressCamera}
          onPressEmoji={onPressEmoji}
          onPressSend={_onPressSend}
          loading={_loading}
          disabledBtnSend={_loading || (!text.trim() && !selectedImage)}
        />
      </View>
      {!isWeb && (
        <EmojiBoardAnimated
          emojiBoardRef={emojiBoardRef}
          onEmojiSelected={onEmojiSelected}
          onPressKeyboard={focus}
          onPressSpace={() => addTextToCursor(' ')}
          onPressBackSpace={backSpaceFromCursor}
        />
      )}
      {disableKeyboardSpacer !== false && <KeyboardSpacer iosOnly />}
    </View>
  );
};

const createStyle = (theme: ITheme, insets: any, loading: boolean) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    root: {
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
      backgroundColor: colors.background,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.small,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingBottom: spacing?.padding.small,
    },
    iconContainer: {
      width: 24,
      height: 24,
      marginRight: spacing?.margin.small,
      borderRadius: 12,
      backgroundColor: theme.colors.primary7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      width: '100%',
      lineHeight: 22,
      paddingTop: spacing?.padding.small,
      paddingBottom: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.large,
      color: loading ? colors.textSecondary : colors.textPrimary,
      fontFamily: fontFamilies.OpenSans,
      fontSize: dimension?.sizes.body,
    },
    textDuplicatedOnWeb: {
      ...Platform.select({
        web: {
          position: 'absolute',
          width: '100%',
          visibility: 'hidden',
        },
      }),
    },
    iconSend: {
      marginBottom: spacing?.margin.base,
      marginHorizontal: spacing?.margin.large,
    },
    loadingContainer: {
      marginBottom: spacing?.margin.base,
      marginHorizontal: spacing?.margin.large,
    },
    buttonEmoji: {position: 'absolute', right: 10, bottom: 10},
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
    selectedImage: {width: 64, height: 64},
    iconCloseSelectedImage: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.iconTint,
      shadowOffset: {width: 0, height: 4},
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
      borderColor: colors.error,
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
