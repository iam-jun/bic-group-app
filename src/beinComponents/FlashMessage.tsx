import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';

import {IconType} from '~/resources/icons';
import spacing from '~/theme/spacing';

export interface FlashMessageProps {
  type?: 'error' | 'success' | 'warning';
  children?: React.ReactNode;
  textProps?: TextProps;
  leftIcon?: IconType;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}

const FlashMessage: FC<FlashMessageProps> = ({
  type = 'warning',
  children,
  textProps,
  leftIcon,
  style,
  onClose,
}: FlashMessageProps) => {
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;

  const flashMessageStyle = {
    success: {
      iconColor: colors.neutral80,
      textColor: colors.neutral80,
      backgroundColor: colors.success,
    },
    warning: {
      iconColor: colors.neutral80,
      textColor: colors.neutral80,
      backgroundColor: colors.warning,
    },
    error: {
      iconColor: colors.neutral80,
      textColor: colors.white,
      backgroundColor: colors.red60,
    },
  };

  const {iconColor, textColor, backgroundColor} =
    flashMessageStyle[type] || flashMessageStyle.success;

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flexDirection: 'row',
      backgroundColor: backgroundColor,
      padding: spacing.padding.base,
    },
    style,
  ]);

  return (
    <View style={containerStyle}>
      {!!leftIcon && (
        <Icon
          style={styles.leftIcon}
          size={16}
          icon={leftIcon}
          tintColor={iconColor}
        />
      )}
      <View style={styles.textContainer}>
        <Text.BodyM {...textProps} color={textColor}>
          {children}
        </Text.BodyM>
      </View>
      {onClose && (
        <Icon icon={'iconClose'} tintColor={iconColor} onPress={onClose} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  leftIcon: {
    marginLeft: spacing.margin.base,
    marginRight: spacing.margin.base,
  },
});

export default FlashMessage;
