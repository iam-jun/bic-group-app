import React from 'react';
import {useTheme} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {TextInputProps as _TextInputProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import {IObject} from '~/interfaces/common';

export interface TextInputProps extends Partial<_TextInputProps> {}

const Input: React.FC<TextInputProps> = ({...props}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  return <TextInput {...props} />;
};

Input.defaultProps = {
  mode: 'flat',
};

export default Input;
