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

import Text, { TextProps, TextVariant } from '~/baseComponents/Text';
import Icon, { IconProps } from '~/baseComponents/Icon';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import spacing from '~/theme/spacing';
import { lineHeights } from '~/theme/dimension';

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
  rightIconProps?: Partial<IconProps>;
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
  const _textVariant = textVariant || 'buttonM';

  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const renderIcon = (
    iconSource: any, iconProps: Partial<IconProps> | undefined,
  ) => {
    if (iconSource) {
      const size = lineHeights[_textVariant];

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
      style={style}
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
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          contentStyle,
        ]}
      >
        {renderLoading()}
        {renderIcon(
          leftIcon, leftIconProps,
        )}
        {typeof children === 'string' ? (
          <Text
            testID="button_wrapper.text"
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
        {renderIcon(
          rightIcon, rightIconProps,
        )}
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
