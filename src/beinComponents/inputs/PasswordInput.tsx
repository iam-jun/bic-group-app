import React from 'react';
import {TextInput as TextInputPaper} from 'react-native-paper';
import TextInput, {TextInputProps} from './TextInput';
import Icon from '~/beinComponents/Icon';
import {View} from 'react-native';

interface Props extends TextInputProps {
  hideEyeIcon?: boolean;
}

const InputPassword: React.FC<Props> = ({hideEyeIcon = false, ...props}) => {
  const [hidePassword, setHidePassword] = React.useState(true);
  const EyeIcon = (
    <TextInputPaper.Icon
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
    <View>
      <TextInput
        secureTextEntry={hidePassword}
        right={!hideEyeIcon && EyeIcon}
        {...props}
      />
    </View>
  );
};

export default InputPassword;
