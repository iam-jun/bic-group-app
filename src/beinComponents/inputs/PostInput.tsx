import React, {useImperativeHandle, useRef} from 'react';
import {
  Keyboard,
  KeyboardType,
  NativeSyntheticEvent,
  ReturnKeyType,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextInputSelectionChangeEventData,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import AutoGrowingTextInput from '~/beinComponents/inputs/AutoGrowingTextInput';
import {useBaseHook} from '~/hooks';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';

export interface PostInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  multiline?: boolean;
  isFullScreen?: boolean;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'; //ANDROID ONLY
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardType;
  returnKeyType?: ReturnKeyType;
  onSubmitEditing?: () => void;
  onSelectionChange?:
    | ((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void)
    | undefined;
  value: string;
  inputRef?: any;
}

const PostInput: React.FC<PostInputProps> = ({
  style,
  placeholder,
  multiline = true,
  isFullScreen = true,
  textAlignVertical = 'top',
  onChangeText,
  keyboardType,
  returnKeyType,
  onSubmitEditing = () => Keyboard.dismiss,
  onSelectionChange,
  value,
  inputRef,
  ...props
}: PostInputProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const {colors} = theme;
  const styles = createStyle(theme);

  const inputStyle: any = StyleSheet.flatten([
    styles.container,
    isFullScreen ? {flex: 1} : {},
    style,
  ]);

  const refInput = inputRef || useRef<any>();
  const refTextinput = useRef<any>();

  const setFocus = () => {
    refTextinput.current?.focus();
  };

  const setBlur = () => {
    refTextinput.current?.blur();
  };

  const setClear = () => {
    refTextinput.current?.clear();
  };

  const getFocused = () => refInput.current?.isFocused();

  useImperativeHandle(refInput, () => ({
    setFocus,
    setBlur,
    setClear,
    getFocused,
  }));

  return (
    <AutoGrowingTextInput
      ref={refTextinput}
      testID="post_input"
      textAlignVertical={textAlignVertical}
      style={inputStyle}
      selectionColor={colors.textSecondary}
      placeholder={placeholder || t('post:placeholder_create_post')}
      placeholderTextColor={colors.textSecondary}
      multiline={multiline}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      onSelectionChange={onSelectionChange}
      {...props}>
      {value}
    </AutoGrowingTextInput>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      margin: spacing?.padding.base,
      padding: 0,
      fontSize: dimension?.sizes.bodyM,
      fontFamily: fontFamilies.BeVietnamProLight,
      color: colors.textPrimary,
    },
  });
};

export default PostInput;
