import React from 'react';
import {StyleProp, TextStyle, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TextInput, HelperText} from 'react-native-paper';
import {TextInputProps as _TextInputProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import {IObject} from '~/interfaces/common';

export interface TextInputProps extends Partial<_TextInputProps> {
  helperType?: 'info' | 'error';
  helperVisible?: boolean;
  helperPadding?: 'normal' | 'none';
  helperContent?: string;
  helperTestID?: string;
}

const Input: React.FC<TextInputProps> = ({...props}) => {
  const {
    helperType = 'info',
    helperVisible,
    helperContent,
    helperTestID,
  } = props;
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  return (
    <View>
      <TextInput {...props} />
      <HelperText
        testID={helperTestID}
        type={helperType}
        visible={helperVisible}>
        {helperContent}
      </HelperText>
    </View>
  );
};

Input.defaultProps = {
  mode: 'flat',
};

export default Input;
