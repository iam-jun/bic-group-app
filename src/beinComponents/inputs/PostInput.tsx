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
import Text from '~/beinComponents/Text';

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
      {...props}>
      <Text useParseText showRawText>
        {value}
      </Text>
    </TextInput>
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
