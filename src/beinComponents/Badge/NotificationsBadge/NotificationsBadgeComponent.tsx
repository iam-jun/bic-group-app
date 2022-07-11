import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

export type NotificationsBadgeType = 'default' | 'info' | 'warning' | 'alert';

export interface NotificationsBadgeComponentProps {
  style?: StyleProp<ViewStyle>;
  variant?: NotificationsBadgeType;
  number?: number;
  maxNumber?: number;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const NotificationsBadgeComponent: React.FC<NotificationsBadgeComponentProps> =
  ({
    style,
    variant = 'default',
    number,
    maxNumber = 9,
    textStyle = {},
    testID,
  }: NotificationsBadgeComponentProps) => {
    if (!number) return null;

    const theme: ITheme = useTheme() as ITheme;
    const styles = themeStyles(theme, variant);
    const numberInText = number > maxNumber ? `${maxNumber}+` : `${number}`;

    return (
      <View style={[styles.dot, style]} testID={testID}>
        <Text variant="subtitle" style={[styles.text, textStyle]}>
          {numberInText}
        </Text>
      </View>
    );
  };

const themeStyles = (theme: ITheme, variant: NotificationsBadgeType) => {
  const {colors} = theme;
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
