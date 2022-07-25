import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import TextInput, { TextInputProps } from './TextInput';
import Icon from '~/beinComponents/Icon';

interface Props extends TextInputProps {
  hideEyeIcon?: boolean;
  passwordInputRef?: React.Ref<RNTextInput>;
  iconColor?: string;
}

const PasswordInput: React.FC<Props> = ({
  hideEyeIcon = false,
  passwordInputRef,
  iconColor,
  ...props
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const [hidePassword, setHidePassword] = React.useState(true);
  const EyeIcon = (
    <Icon
      icon={hidePassword ? 'iconEye' : 'iconEyeOff'}
      size={20}
      onPress={() => setHidePassword(!hidePassword)}
      tintColor={iconColor || colors.neutral80}
    />
  );

  return (
    <TextInput
      secureTextEntry={hidePassword}
      RightComponent={!hideEyeIcon && EyeIcon}
      ref={passwordInputRef}
      testID="password_input"
      {...props}
    />
  );
};

const _PasswordInput = React.forwardRef(
  (props: TextInputProps, ref?: React.Ref<RNTextInput>) => (
    <PasswordInput passwordInputRef={ref} {...props} />
  ),
);

export default React.memo(_PasswordInput);
