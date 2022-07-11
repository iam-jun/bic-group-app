import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
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
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  const flashMessageStyle = {
    success: {
      iconColor: colors.iconTint,
      textColor: colors.textSuccess,
      backgroundColor: colors.success,
    },
    warning: {
      iconColor: colors.iconTint,
      textColor: colors.textWarning,
      backgroundColor: colors.warning,
    },
    error: {
      iconColor: colors.iconTintReversed,
      textColor: colors.textDanger,
      backgroundColor: colors.error,
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
        <Text.Body {...textProps} color={textColor}>
          {children}
        </Text.Body>
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
