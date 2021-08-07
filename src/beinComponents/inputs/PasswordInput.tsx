import React from 'react';
import {TextInput as TextInputPaper, useTheme} from 'react-native-paper';
import TextInput, {TextInputProps} from './TextInput';
import {ITheme} from '~/theme/interfaces';

const InputPassword: React.FC<TextInputProps> = ({...props}) => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing} = theme;
  const [hidePassword, setHidePassword] = React.useState(true);

  return (
    <TextInput
      {...props}
      secureTextEntry={hidePassword}
      right={
        <TextInputPaper.Icon
          style={{marginTop: spacing.margin.base}}
          name={hidePassword ? 'eye' : 'eye-off'}
          onPress={() => setHidePassword(!hidePassword)}
        />
      }
    />
  );
};

export default InputPassword;
