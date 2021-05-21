import React from 'react';
import {TextInput, useTheme} from 'react-native-paper';
import icons from '~/constants/icons';
import {IObject} from '~/interfaces/common';
import Input, {TextInputProps} from '.';
import Icon from '../Icon';

const InputPassword: React.FC<TextInputProps> = ({...props}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;
  const [hidePassword, setHidePassword] = React.useState(true);

  return (
    <Input
      {...props}
      secureTextEntry={hidePassword}
      right={
        <TextInput.Icon
          name={hidePassword ? 'eye' : 'eye-off'}
          onPress={() => setHidePassword(!hidePassword)}
        />
      }
    />
  );
};

export default InputPassword;
