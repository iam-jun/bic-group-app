import React from 'react';
import {TextInput as TextInputPaper} from 'react-native-paper';
import TextInput, {TextInputProps} from './TextInput';
import Icon from '~/beinComponents/Icon';
import {View} from 'react-native';

const InputPassword: React.FC<TextInputProps> = ({...props}) => {
  const [hidePassword, setHidePassword] = React.useState(true);

  return (
    <View>
      <TextInput
        secureTextEntry={hidePassword}
        right={
          <TextInputPaper.Icon
            name={() => (
              <Icon
                icon={hidePassword ? 'iconEye' : 'iconEyeOff'}
                size={20}
                onPress={() => setHidePassword(!hidePassword)}
              />
            )}
          />
        }
        {...props}
      />
    </View>
  );
};

export default InputPassword;
