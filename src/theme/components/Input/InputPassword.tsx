import React from 'react';
import {useTheme} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {TextInputProps} from '.';

const InputPassword: React.FC<TextInputProps> = ({...props}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;
  const [visible, setVisible] = React.useState(false);

  return (
    <TextInput
      {...props}
      mode="outlined"
      label="Label Name"
      placeholder="Enter placeholder"
      left={
        <TextInput.Icon
          name={<Icon name="info" color="#ff0000" />} // where <Icon /> is any component from vector-icons or anything else
          onPress={() => {}}
        />
      }
    />
  );
};

export default InputPassword;
