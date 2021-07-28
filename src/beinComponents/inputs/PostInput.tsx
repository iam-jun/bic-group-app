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
}

const PostInput: React.FC<PostInputProps> = ({
  style,
  placeholder,
  multiline,
  isFullScreen = true,
  textAlignVertical = 'top',
  onChangeText,
  keyboardType,
  returnKeyType,
  onSubmitEditing = () => Keyboard.dismiss,
  ...props
}: PostInputProps) => {
  const theme: ITheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);

  return (
    <TextInput
      textAlignVertical={textAlignVertical}
      style={StyleSheet.flatten([
        styles.container,
        isFullScreen ? {flex: 1} : {},
        style,
      ])}
      selectionColor={colors.textInput}
      placeholder={placeholder}
      multiline={multiline}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
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
