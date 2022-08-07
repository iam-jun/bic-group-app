import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text, { TextProps, TextVariant } from '~/beinComponents/Text';
import Icon, { IconProps } from '~/beinComponents/Icon';
import { useKeySelector } from '~/hooks/selector';
import spacing, { borderRadius } from '~/theme/spacing';
import { lineHeights } from '~/theme/dimension';

export interface ButtonWrapperProps extends TouchableOpacityProps {
  nativeID?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textVariant?: TextVariant;
  textProps?: TextProps;
  useI18n?: boolean;
  icon?: any;
  iconProps?: IconProps;
  underlayColor?: string;
  loading?: boolean;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  testID,
  children,
  style,
  contentStyle,
  disabled,
  textVariant,
  textProps,
  useI18n,
  icon,
  iconProps,
  loading,
  activeOpacity,
  ...props
}: ButtonWrapperProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const _textVariant = textVariant || 'buttonM';

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const renderIcon = (
    iconSource: any, iconProps: IconProps | undefined,
  ) => {
    if (!loading && iconSource) {
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
    <TouchableOpacity
      testID={testID}
      style={style}
      disabled={!isInternetReachable || disabled}
      activeOpacity={activeOpacity}
      {...props}
    >
      <View
        testID="button_wrapper.content"
        style={[styles.container, contentStyle]}
      >
        {renderLoading()}
        {renderIcon(
          icon, iconProps,
        )}
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.small,
  },
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
