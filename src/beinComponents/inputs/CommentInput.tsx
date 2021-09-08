import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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

import DocumentPicker from '~/beinComponents/DocumentPicker';
import Icon from '~/beinComponents/Icon';
import ImagePicker from '~/beinComponents/ImagePicker';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import {IFileResponse} from '~/interfaces/common';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';
import Button from '~/beinComponents/Button';

export interface CommentInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPressSend?: () => void;
  onPressSelectImage?: (file: IFileResponse) => void;
  onPressFile?: (file: IFileResponse) => void;
  onSelectionChange?:
    | ((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void)
    | undefined;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  value?: string;
  HeaderComponent?: React.ReactNode;
  textInputRef?: any;
  loading?: boolean;
  disableKeyboardSpacer?: boolean;
  onContentSizeChange?: (event: any) => void;
}

const DEFAULT_HEIGHT = 44;
const LIMIT_HEIGHT = 100;

const CommentInput: React.FC<CommentInputProps> = ({
  style,
  placeholder = 'Aa',
  onChangeText,
  onPressSend,
  onPressSelectImage,
  onPressFile,
  onSelectionChange,
  autoFocus,
  blurOnSubmit,
  value,
  HeaderComponent,
  textInputRef,
  loading = false,
  disableKeyboardSpacer,
  onContentSizeChange,
  ...props
}: CommentInputProps) => {
  const [text, setText] = useState<string>(value || '');
  const heightAnimated = useRef(new Animated.Value(DEFAULT_HEIGHT)).current;

  const showSendAnim = useRef(new Animated.Value(0)).current;
  const showButtonsAnim = useRef(new Animated.Value(1)).current;

  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme, loading);
  const [inputSelection, setInputSelection] = useState<any>();
  const supportedMarkdownKey = {
    b: '**',
    i: '*',
  };

  useEffect(() => {
    if (typeof value === 'string' && value !== text) {
      setText(value);
    }
  }, [value]);

  useEffect(() => {
    if (text?.length > 0) {
      showButtons(false);
      showSend(true);
    } else {
      showSend(false);
    }
  }, [text]);

  const _onPressSelectImage = () => {
    ImagePicker.openPicker({
      cropping: false,
      mediaType: 'any',
      multiple: false,
      compressVideoPreset: 'Passthrough',
    }).then(result => {
      if (!result) return;

      const file = {
        name: result.filename,
        size: result.size,
        type: result.mime,
        uri: result.path,
      };
      // @ts-ignore
      onPressSelectImage?.(Platform.OS === 'web' ? result : file);
    });
  };

  const _onPressFile = async () => {
    const file = await DocumentPicker.pickSingle();
    onPressFile?.(file);
  };

  const onPressSticker = () => {
    alert('onPressSticker');
  };

  const onPressEmoji = () => {
    alert('onPressEmoji');
  };

  const _onPressSend = () => {
    blurOnSubmit && Keyboard.dismiss();
    onPressSend?.();
  };

  const _onChangeText = (value: string) => {
    setText(value);
    onChangeText?.(value);
  };

  const _onSelectionChange = (event: any) => {
    onSelectionChange?.(event);
    Platform.OS === 'web' && setInputSelection(event.nativeEvent.selection);
  };

  const showButtons = (show: boolean) => {
    Animated.timing(showButtonsAnim, {
      toValue: show ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const showSend = (show: boolean) => {
    Animated.timing(showSendAnim, {
      toValue: show ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handleKeyEvent = (event: any) => {
    if (!event?.shiftKey && event?.key === 'Enter') {
      event.preventDefault();
      _onPressSend();
    } else if (
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

  const _onContentSizeChange = (e: any) => {
    onContentSizeChange?.(e);
    let newHeight = Math.min(
      Math.max(DEFAULT_HEIGHT, e.nativeEvent.contentSize.height),
      LIMIT_HEIGHT,
    );
    if (value?.length === 0) {
      newHeight = DEFAULT_HEIGHT;
    }
    Animated.timing(heightAnimated, {
      toValue: newHeight,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const onKeyPress = Platform.OS !== 'web' ? undefined : handleKeyEvent;

  const inputStyle: any = StyleSheet.flatten([
    styles.textInput,
    Platform.OS === 'web' ? {outlineWidth: 0} : {},
  ]);

  const buttonsMarginLeft = showButtonsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-88, 16],
  });

  const textInputMarginLeft = showButtonsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const textInputMarginRight = showSendAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-34, 0],
  });

  const renderButtons = () => {
    return (
      <View style={styles.buttonsContainer}>
        <Animated.View
          style={{
            flexDirection: 'row',
            marginLeft: buttonsMarginLeft,
            marginRight: spacing?.margin.small,
          }}>
          <Button
            style={styles.iconContainer}
            onPress={_onPressSelectImage}
            disabled={loading}>
            <Icon
              size={13}
              icon={'ImageV'}
              tintColor={theme.colors.iconTintReversed}
            />
          </Button>
          <Button
            style={styles.iconContainer}
            onPress={_onPressFile}
            disabled={loading}>
            <Icon
              size={13}
              icon={'attachment'}
              tintColor={theme.colors.iconTintReversed}
            />
          </Button>
          <Button
            style={styles.iconContainer}
            onPress={onPressSticker}
            disabled={loading}>
            <Icon
              size={13}
              icon={'iconSticker'}
              tintColor={theme.colors.iconTintReversed}
            />
          </Button>
        </Animated.View>
        <Button onPress={() => showButtons(true)} disabled={loading}>
          <Icon
            size={24}
            icon={'AngleRightB'}
            tintColor={theme.colors.primary7}
          />
        </Button>
      </View>
    );
  };

  return (
    <View style={[styles.root, style]}>
      {HeaderComponent}
      <View style={styles.container}>
        {renderButtons()}
        <Animated.View
          style={{
            flexDirection: 'row',
            flex: 1,
            zIndex: 1,
            marginLeft: textInputMarginLeft,
            marginRight: textInputMarginRight,
          }}>
          <Animated.View style={{flex: 1, height: heightAnimated}}>
            <TextInput
              selection={inputSelection}
              {...props}
              onContentSizeChange={_onContentSizeChange}
              ref={textInputRef}
              style={inputStyle}
              selectionColor={colors.textInput}
              multiline={true}
              autoFocus={autoFocus}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
              value={text}
              onChangeText={_onChangeText}
              onSelectionChange={_onSelectionChange}
              onKeyPress={onKeyPress}
            />
          </Animated.View>
          <Button
            style={{position: 'absolute', right: 10, bottom: 10}}
            onPress={onPressEmoji}
            disabled={loading}>
            <Icon
              size={24}
              icon={'iconSmileSolid'}
              tintColor={theme.colors.iconTintReversed}
            />
          </Button>
        </Animated.View>
        <Button onPress={_onPressSend} disabled={loading}>
          {loading ? (
            <ActivityIndicator
              style={styles.loadingContainer}
              size={'small'}
              color={colors.disabled}
            />
          ) : (
            <Icon
              style={styles.iconSend}
              size={16}
              icon={'iconSend'}
              tintColor={theme.colors.primary7}
            />
          )}
        </Button>
      </View>
      {disableKeyboardSpacer !== false && <KeyboardSpacer iosOnly />}
    </View>
  );
};

const createStyle = (theme: ITheme, loading: boolean) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    root: {
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
      backgroundColor: colors.background,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingVertical: spacing?.padding.small,
    },
    buttonsContainer: {
      flexDirection: 'row',
      paddingBottom: 10,
      paddingRight: spacing?.padding.base,
      overflow: 'hidden',
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
      flex: 1,
      lineHeight: 22,
      paddingRight: 36,
      paddingTop: spacing?.padding.small,
      paddingBottom: spacing?.padding.small,
      paddingLeft: spacing?.padding.base,
      color: loading ? colors.textSecondary : colors.textPrimary,
      backgroundColor: colors.placeholder,
      borderRadius: spacing?.borderRadius.large,
      fontFamily: fontFamilies.Segoe,
      fontSize: dimension?.sizes.body,
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
  });
};

export default CommentInput;
