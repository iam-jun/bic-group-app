import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import TextInput, { TextInputProps } from '../TextInput';
import Icon from '~/baseComponents/Icon';

export interface PasswordInputProps extends TextInputProps {
  hideEyeIcon?: boolean;
  passwordInputRef?: React.Ref<RNTextInput>;
  iconColor?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  passwordInputRef,
  hideEyeIcon = false,
  iconColor,
  ...props
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const [hidePassword, setHidePassword] = React.useState(true);
  const EyeIcon = (
    <Icon
      icon={hidePassword ? 'iconEye' : 'iconEyeOff'}
      size={24}
      onPress={() => setHidePassword(!hidePassword)}
      tintColor={iconColor || colors.neutral80}
    />
  );

  return (
    <TextInput
      testID="password_input"
      ref={passwordInputRef}
      secureTextEntry={hidePassword}
      RightComponent={!hideEyeIcon && EyeIcon}
      {...props}
    />
  );
};

const _PasswordInput = React.forwardRef((
  props: TextInputProps, ref?: React.Ref<RNTextInput>,
) => (
  <PasswordInput passwordInputRef={ref} {...props} />
));

export default React.memo(_PasswordInput);
