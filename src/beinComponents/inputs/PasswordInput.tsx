import React from 'react';
import {useTheme} from 'react-native-paper';
import TextInput, {TextInputProps} from './TextInput';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {View, Text} from 'react-native';
import icons from '~/resources/icons';

const InputPassword: React.FC<TextInputProps> = ({...props}) => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing} = theme;
  const [hidePassword, setHidePassword] = React.useState(true);

  return (
    <View>
      <TextInput
        {...props}
        secureTextEntry={hidePassword}
        right={<Text>haha</Text>}
      />
      <Icon
        // @ts-ignore
        icon={hidePassword ? icons.iconEye : icons.iconEyeOff}
        style={{
          position: 'absolute',
          right: spacing.margin.large,
          top: '37.5%',
        }}
        onPress={() => setHidePassword(!hidePassword)}
      />
    </View>
  );
};

export default InputPassword;
