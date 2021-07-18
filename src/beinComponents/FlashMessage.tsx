import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';

export interface FlashMessageProps {
  type?: 'error' | 'success' | 'warning';
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}

const FlashMessage: React.FC<FlashMessageProps> = ({
  type = 'warning',
  children,
  style,
  onClose,
}: FlashMessageProps) => {
  const theme: ITheme = useTheme();
  const {colors, spacing} = theme;

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
      padding: spacing?.padding.base,
    },
    style,
  ]);

  return (
    <View style={containerStyle}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text.Body color={textColor}>{children}</Text.Body>
      </View>
      {onClose && (
        <Icon icon={'iconClose'} tintColor={iconColor} onPress={onClose} />
      )}
    </View>
  );
};

export default FlashMessage;
