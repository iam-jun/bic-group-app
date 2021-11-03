import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Text} from '~/components';
import {ITheme} from '~/theme/interfaces';

export type NotificationsBadgeType = 'default' | 'info' | 'warning' | 'alert';

export interface NotificationsBadgeComponentProps {
  style?: StyleProp<ViewStyle>;
  variant?: NotificationsBadgeType;
  number?: number;
  maxNumber?: number;
}

const NotificationsBadgeComponent: React.FC<NotificationsBadgeComponentProps> =
  ({
    style,
    variant = 'default',
    number,
    maxNumber = 9,
  }: NotificationsBadgeComponentProps) => {
    if (!number) return null;

    const theme: ITheme = useTheme() as ITheme;
    const styles = themeStyles(theme, variant);
    const numberInText = number > maxNumber ? `${maxNumber}+` : `${number}`;

    return (
      <View style={[styles.dot, style]}>
        <Text.Subtitle style={styles.text}>{numberInText}</Text.Subtitle>
      </View>
    );
  };

const themeStyles = (theme: ITheme, variant: NotificationsBadgeType) => {
  const {colors, spacing} = theme;
  const defaultWidth = 20;

  const dotColors = {
    default: colors.bgDisable,
    info: colors.textInfo,
    warning: colors.statusOrange,
    alert: colors.error,
  };

  const textColor =
    variant === 'default' ? colors.textPrimary : colors.textReversed;

  return StyleSheet.create({
    dot: {
      borderRadius: spacing.borderRadius.large,
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
