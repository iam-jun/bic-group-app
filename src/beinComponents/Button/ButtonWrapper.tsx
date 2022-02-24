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
import {createTextStyle} from '~/beinComponents/Text/textStyle';
import {useKeySelector} from '~/hooks/selector';

export interface ButtonWrapperProps {
  nativeID?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: (e: any) => void;
  onLongPress?: (e: any) => void;
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
  nativeID,
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
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);
  const textStyles = createTextStyle(theme);
  textVariant = textVariant || 'buttonBase';

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const renderIcon = (iconSource: any, iconProps: IconProps | undefined) => {
    if (iconSource) {
      // In order to fix the title on web is pushed beneath the avg line
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
          color={colors.textDisabled}
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
      disabled={!isInternetReachable || disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      underlayColor={underlayColor}
      hitSlop={hitSlop}
      activeOpacity={activeOpacity}
      style={StyleSheet.flatten([style])}>
      <View
        testID="button_wrapper.content"
        style={StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          contentStyle,
        ])}>
        {renderLoading()}
        {renderIcon(leftIcon, leftIconProps)}
        {typeof children === 'string' ? (
          <Text
            variant={textVariant}
            style={styles.text}
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

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    icon: {
      marginHorizontal: spacing?.margin.small,
    },
    loading: {
      marginRight: spacing?.margin.tiny,
    },
    text: {
      textAlign: 'center',
    },
  });
};

export default ButtonWrapper;
