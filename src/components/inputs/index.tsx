import React from 'react';
import {StyleProp, TextStyle, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TextInput, HelperText} from 'react-native-paper';
import {TextInputProps as _TextInputProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';

export interface TextInputProps extends Partial<_TextInputProps> {
  helperType?: 'info' | 'error';
  helperVisible?: boolean;
  helperPadding?: 'normal' | 'none';
  helperContent?: string;
  helperTestID?: string;
  helperAction?: string;
  helperContentTriggerAction?: string;
  helperOnPressAction?: () => {};
  style?: StyleProp<TextStyle>;
  secondaryBackground?: boolean;
  roundness?: 'small' | 'base' | 'large' | 'big';
}

const roundnessSizes = {
  small: spacing.borderRadius.small,
  base: spacing.borderRadius.base,
  large: spacing.borderRadius.large,
  big: spacing.borderRadius.big,
};

const Input: React.FC<TextInputProps> = ({
  style,
  helperType,
  helperVisible,
  helperContent,
  helperTestID,
  helperContentTriggerAction,
  helperAction,
  helperOnPressAction,
  secondaryBackground,
  roundness,
  ...props
}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  return (
    <View>
      <TextInput
        style={[
          {
            height: 44,
            justifyContent: 'center',
            backgroundColor: secondaryBackground && colors.bgColorSecondary,
          },
          style,
        ]}
        theme={{
          ...theme,
          roundness: roundness && roundnessSizes[roundness],
        }}
        {...props}
      />
      {helperType && (
        <HelperText
          testID={helperTestID}
          type={helperType}
          visible={helperVisible}>
          {helperContent}
          {!!helperContentTriggerAction &&
            !!helperAction &&
            helperContentTriggerAction === helperContent && (
              <HelperText
                style={{textDecorationLine: 'underline'}}
                type={helperType}
                onPress={helperOnPressAction}>
                {helperAction}
              </HelperText>
            )}
        </HelperText>
      )}
    </View>
  );
};

Input.defaultProps = {
  mode: 'outlined',
  helperType: 'info',
  roundness: 'small',
};

export default Input;
