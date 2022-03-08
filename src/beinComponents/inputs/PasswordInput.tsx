import React from 'react';
import {TextInput as RNTextInput} from 'react-native';
import {TextInput as TextInputPaper} from 'react-native-paper';
import TextInput, {TextInputProps} from './TextInput';
import Icon from '~/beinComponents/Icon';

interface Props extends TextInputProps {
  hideEyeIcon?: boolean;
  passwordInputRef?: React.Ref<RNTextInput>;
}

const PasswordInput: React.FC<Props> = ({
  hideEyeIcon = false,
  passwordInputRef,
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(true);
  const EyeIcon = (
    <TextInputPaper.Icon
      testID={'password_input.eye_icon'}
      name={() => (
        <Icon
          icon={hidePassword ? 'iconEye' : 'iconEyeOff'}
          size={20}
          onPress={() => setHidePassword(!hidePassword)}
        />
      )}
    />
  );

  return (
    <TextInput
      secureTextEntry={hidePassword}
      right={!hideEyeIcon && EyeIcon}
      ref={passwordInputRef}
      testID={'password_input'}
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
