import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle, StyleSheet} from 'react-native';
import Text, {TextProps, TextVariant} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface ButtonWrapperProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  textVariant?: TextVariant;
  textProps?: TextProps;
  underlayColor?: string;
  TouchableComponent?: any;
  testID?: string;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  testID,
  children,
  style,
  onPress,
  onLongPress,
  disabled,
  textVariant = 'buttonBase',
  textProps,
  underlayColor,
  TouchableComponent = TouchableOpacity,
}: ButtonWrapperProps) => {
  const {colors}: ITheme = useTheme();

  return (
    <TouchableComponent
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      underlayColor={underlayColor}
      style={StyleSheet.flatten([style])}>
      {typeof children === 'string' ? (
        <Text
          variant={textVariant}
          color={disabled ? colors.textDisabled : undefined}
          {...textProps}>
          {children}
        </Text>
      ) : (
        <>{children}</>
      )}
    </TouchableComponent>
  );
};

export default ButtonWrapper;
