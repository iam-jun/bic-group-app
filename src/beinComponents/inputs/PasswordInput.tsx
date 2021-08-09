import React from 'react';
import {useTheme} from 'react-native-paper';
import TextInput, {TextInputProps} from './TextInput';
import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {View} from 'react-native';
import icons from '~/resources/icons';

const InputPassword: React.FC<TextInputProps> = ({...props}) => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing} = theme;
  const [hidePassword, setHidePassword] = React.useState(true);

  return (
    <View>
      <TextInput {...props} secureTextEntry={hidePassword} right={<></>} />
      <Icon
        // @ts-ignore
        icon={hidePassword ? icons.iconEye : icons.iconEyeOff}
        style={{
          position: 'absolute',
          right: spacing.margin.large,
          // @ts-ignore
          top: spacing.margin.base + spacing.margin.small || 13,
        }}
        onPress={() => setHidePassword(!hidePassword)}
      />
    </View>
  );
};

export default InputPassword;
