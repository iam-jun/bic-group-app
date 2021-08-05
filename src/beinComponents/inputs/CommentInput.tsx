import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  StyleProp,
  ViewStyle,
  Keyboard,
} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {fontFamilies} from '~/theme/fonts';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

export interface CommentInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPressSend?: () => void;
  autoFocus?: boolean;
  value?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  style,
  placeholder = 'Aa',
  onChangeText,
  onPressSend,
  autoFocus,
  value,
}: CommentInputProps) => {
  const [text, setText] = useState<string>(value || '');

  const showSendAnim = useRef(new Animated.Value(0)).current;
  const showButtonsAnim = useRef(new Animated.Value(1)).current;

  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

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

  const onPressSelectImage = () => {
    alert('onPressSelectImage');
  };

  const onPressFile = () => {
    alert('onPressFile');
  };

  const onPressSticker = () => {
    alert('onPressSticker');
  };

  const onPressEmoji = () => {
    alert('onPressEmoji');
  };

  const _onPressSend = () => {
    Keyboard.dismiss();
    onPressSend?.();
  };

  const _onChangeText = (value: string) => {
    setText(value);
    onChangeText?.(value);
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
          <ButtonWrapper
            style={styles.iconContainer}
            onPress={onPressSelectImage}>
            <Icon
              size={13}
              icon={'ImageV'}
              tintColor={theme.colors.iconTintReversed}
            />
          </ButtonWrapper>
          <ButtonWrapper style={styles.iconContainer} onPress={onPressFile}>
            <Icon
              size={13}
              icon={'attachment'}
              tintColor={theme.colors.iconTintReversed}
            />
          </ButtonWrapper>
          <ButtonWrapper style={styles.iconContainer} onPress={onPressSticker}>
            <Icon
              size={13}
              icon={'iconSticker'}
              tintColor={theme.colors.iconTintReversed}
            />
          </ButtonWrapper>
        </Animated.View>
        <Icon
          size={24}
          icon={'AngleRightB'}
          tintColor={theme.colors.primary7}
          onPress={() => showButtons(true)}
        />
      </View>
    );
  };

  return (
    <View>
      <View style={StyleSheet.flatten([styles.container, style])}>
        {renderButtons()}
        <Animated.View
          style={{
            flexDirection: 'row',
            flex: 1,
            zIndex: 1,
            marginLeft: textInputMarginLeft,
            marginRight: textInputMarginRight,
          }}>
          <TextInput
            style={styles.textInput}
            selectionColor={colors.textInput}
            multiline={true}
            autoFocus={autoFocus}
            placeholder={placeholder}
            value={text}
            onChangeText={_onChangeText}
          />
          <ButtonWrapper
            style={{position: 'absolute', right: 10, bottom: 10}}
            onPress={onPressEmoji}>
            <Icon
              size={24}
              icon={'iconSmileSolid'}
              tintColor={theme.colors.iconTintReversed}
            />
          </ButtonWrapper>
        </Animated.View>
        <Icon
          style={styles.iconSend}
          onPress={_onPressSend}
          size={16}
          icon={'iconSend'}
          tintColor={theme.colors.primary7}
        />
      </View>
      <KeyboardSpacer />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingVertical: spacing?.padding.small,
      backgroundColor: colors.background,
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
      minHeight: 42,
      maxHeight: 90,
      lineHeight: 22,
      paddingRight: 36,
      paddingTop: spacing?.padding.small,
      paddingBottom: spacing?.padding.small,
      paddingLeft: spacing?.padding.base,
      color: colors.textPrimary,
      backgroundColor: colors.placeholder,
      borderRadius: spacing?.borderRadius.large,
      fontFamily: fontFamilies.Segoe,
      fontSize: dimension?.sizes.body,
    },
    iconSend: {
      marginBottom: spacing?.margin.base,
      marginHorizontal: spacing?.margin.large,
    },
  });
};

export default CommentInput;
