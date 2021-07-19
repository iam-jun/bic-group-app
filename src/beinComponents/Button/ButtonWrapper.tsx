import React from 'react';
import {
  View,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Text, {TextProps, TextVariant} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Icon, {IconProps} from '~/beinComponents/Icon';

export interface ButtonWrapperProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  textVariant?: TextVariant;
  textProps?: TextProps;
  leftIcon?: any;
  leftIconProps?: IconProps;
  rightIcon?: any;
  rightIconProps?: IconProps;
  underlayColor?: string;
  TouchableComponent?: any;
  testID?: string;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  testID,
  children,
  style,
  contentStyle,
  onPress,
  onLongPress,
  disabled,
  textVariant = 'buttonBase',
  textProps,
  leftIcon,
  leftIconProps,
  rightIcon,
  rightIconProps,
  underlayColor,
  TouchableComponent = TouchableOpacity,
}: ButtonWrapperProps) => {
  const {colors, spacing}: ITheme = useTheme();

  const renderIcon = (iconSource: any, iconProps: IconProps | undefined) => {
    if (iconSource) {
      return (
        <Icon
          icon={iconSource}
          tintColor={textProps?.color}
          style={{marginHorizontal: spacing?.margin.small}}
          {...iconProps}
        />
      );
    }
    return null;
  };

  return (
    <TouchableComponent
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      underlayColor={underlayColor}
      style={StyleSheet.flatten([style])}>
      <View style={StyleSheet.flatten([{flexDirection: 'row'}, contentStyle])}>
        {renderIcon(leftIcon, leftIconProps)}
        {typeof children === 'string' ? (
          <Text
            variant={textVariant}
            style={{textAlign: 'center'}}
            color={disabled ? colors.textDisabled : undefined}
            {...textProps}>
            {children}
          </Text>
        ) : (
          children
        )}
        {renderIcon(rightIcon, rightIconProps)}
      </View>
    </TouchableComponent>
  );
};

export default ButtonWrapper;
