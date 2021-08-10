import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Text, {TextProps, TextVariant} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {ActivityIndicator, useTheme} from 'react-native-paper';
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
  useI18n?: boolean;
  leftIcon?: any;
  leftIconProps?: IconProps;
  rightIcon?: any;
  rightIconProps?: IconProps;
  underlayColor?: string;
  TouchableComponent?: any;
  testID?: string;
  loading?: boolean;
  activeOpacity?: number;
  hitSlop?: {top: number; bottom: number; right: number; left: number};
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  testID,
  children,
  style,
  contentStyle,
  onPress,
  onLongPress,
  disabled,
  textVariant,
  textProps,
  useI18n,
  leftIcon,
  leftIconProps,
  rightIcon,
  rightIconProps,
  underlayColor,
  loading,
  activeOpacity,
  hitSlop,
  TouchableComponent = TouchableOpacity,
}: ButtonWrapperProps) => {
  const {colors, spacing}: ITheme = useTheme() as ITheme;
  textVariant = textVariant || 'buttonBase';

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

  const renderLoading = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={colors.textDisabled}
          style={{marginRight: spacing?.margin.tiny}}
          size={12}
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
      hitSlop={hitSlop}
      activeOpacity={activeOpacity}
      style={StyleSheet.flatten([style])}>
      <View
        style={StyleSheet.flatten([
          {flexDirection: 'row', alignItems: 'center'},
          contentStyle,
        ])}>
        {renderLoading()}
        {renderIcon(leftIcon, leftIconProps)}
        {typeof children === 'string' ? (
          <Text
            variant={textVariant}
            style={{textAlign: 'center'}}
            color={disabled ? colors.textDisabled : undefined}
            useI18n={useI18n}
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
