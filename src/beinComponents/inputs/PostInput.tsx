import React from 'react';
import {
  Keyboard,
  KeyboardType,
  ReturnKeyType,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  Platform,
} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {fontFamilies} from '~/theme/fonts';

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
  value: string;
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
  value,
  ...props
}: PostInputProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const inputStyle: any = StyleSheet.flatten([
    styles.container,
    isFullScreen ? {flex: 1} : {},
    Platform.OS === 'web' ? {outlineWidth: 0} : {},
    style,
  ]);

  return (
    <TextInput
      textAlignVertical={textAlignVertical}
      style={inputStyle}
      selectionColor={colors.textInput}
      placeholder={placeholder}
      multiline={multiline}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      value={value}
      {...props}
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      margin: spacing?.padding.base,
      padding: 0,
      fontSize: dimension?.sizes.body,
      fontFamily: fontFamilies.Segoe,
      color: colors.textPrimary,
    },
  });
};

export default PostInput;
