import React from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text, { TextProps, TextVariant } from '~/beinComponents/Text';
import Icon, { IconProps } from '~/beinComponents/Icon';
import { createTextStyle } from '~/beinComponents/Text/textStyle';
import { useKeySelector } from '~/hooks/selector';
import spacing from '~/theme/spacing';

export interface ButtonWrapperProps {
  nativeID?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
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
  onPress?: (e: any) => void;
  onLongPress?: (e: any) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  nativeID,
  testID,
  children,
  style,
  contentStyle,
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
  onPress,
  onLongPress,
  onLayout,
}: ButtonWrapperProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const textStyles = createTextStyle(theme);
  textVariant = textVariant || 'buttonM';

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const renderIcon = (iconSource: any, iconProps: IconProps | undefined) => {
    if (iconSource) {
      // @ts-ignore
      const size = textStyles[textVariant].lineHeight;

      return (
        <Icon
          testID="button_wrapper.icon"
          icon={iconSource}
          tintColor={textProps?.color}
          style={styles.icon}
          size={size}
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
          color={colors.gray40}
          style={styles.loading}
          size={12}
          testID="button_wrapper.loading"
        />
      );
    }
    return null;
  };

  return (
    <TouchableComponent
      nativeID={nativeID}
      testID={testID}
      style={StyleSheet.flatten([style])}
      disabled={!isInternetReachable || disabled}
      underlayColor={underlayColor}
      hitSlop={hitSlop}
      activeOpacity={activeOpacity}
      onPress={onPress}
      onLongPress={onLongPress}
      onLayout={onLayout}
    >
      <View
        testID="button_wrapper.content"
        style={StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          contentStyle,
        ])}
      >
        {renderLoading()}
        {renderIcon(leftIcon, leftIconProps)}
        {typeof children === 'string' ? (
          <Text
            variant={textVariant}
            style={styles.text}
            color={disabled ? colors.gray40 : undefined}
            useI18n={useI18n}
            {...textProps}
          >
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

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: spacing.margin.small,
  },
  loading: {
    marginRight: spacing.margin.tiny,
  },
  text: {
    textAlign: 'center',
  },
});

export default ButtonWrapper;
