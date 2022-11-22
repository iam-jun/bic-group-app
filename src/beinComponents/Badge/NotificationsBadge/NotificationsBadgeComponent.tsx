import React from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle, TextStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';

export type NotificationsBadgeType = 'default' | 'info' | 'alert';

export interface NotificationsBadgeComponentProps {
  style?: StyleProp<ViewStyle>;
  variant?: NotificationsBadgeType;
  number?: number;
  maxNumber?: number;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const NotificationsBadgeComponent: React.FC<NotificationsBadgeComponentProps> = ({
  style,
  variant = 'default',
  number,
  maxNumber = 9,
  textStyle = {},
  testID,
}: NotificationsBadgeComponentProps) => {
  if (!number) return null;

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(
    theme, variant,
  );
  const numberInText = number > maxNumber ? `${maxNumber}+` : `${number}`;

  return (
    <View style={[styles.dot, style]} testID={testID}>
      <Text.BodyS style={[styles.text, textStyle]}>{numberInText}</Text.BodyS>
    </View>
  );
};

const themeStyles = (
  theme: ExtendedTheme, variant: NotificationsBadgeType,
) => {
  const { colors } = theme;
  const defaultWidth = 20;

  const dotColors = {
    default: colors.gray20,
    info: colors.blue50,
    alert: colors.red60,
  };

  const textColor = variant === 'default' ? colors.neutral80 : colors.white;

  return StyleSheet.create({
    dot: {
      borderRadius: spacing.borderRadius.pill,
      paddingBottom: 2,
      paddingHorizontal: 5,
      minWidth: defaultWidth,
      height: defaultWidth,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: dotColors[variant],
    },
    text: {
      lineHeight: spacing.lineHeight.base,
      color: textColor,
      textAlign: 'center',
    },
  });
};

export default NotificationsBadgeComponent;
