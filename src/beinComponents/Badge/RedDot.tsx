import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Text} from '~/components';
import {ITheme} from '~/theme/interfaces';

const MAX_NUMBER = 9;

interface RedDotProps {
  style?: StyleProp<ViewStyle>;
  number: number;
  maxNumber?: number;
}

// a component to display a red dot with a number inside
// use for unseen chat message or unseen notification
const RedDot: React.FC<RedDotProps> = ({
  style,
  number,
  maxNumber = MAX_NUMBER,
}: RedDotProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const numberInText = number > maxNumber ? `${maxNumber}+` : `${number}`;

  return (
    <View style={[styles.dot, style]}>
      <Text.Subtitle style={styles.text}>{numberInText}</Text.Subtitle>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  const defaultWidth = 20;

  return StyleSheet.create({
    dot: {
      borderRadius: spacing.borderRadius.large,
      paddingBottom: 2,
      paddingHorizontal: 5,
      minWidth: defaultWidth,
      height: defaultWidth,
      backgroundColor: colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      lineHeight: spacing.lineHeight.base,
      color: colors.textReversed,
      textAlign: 'center',
    },
  });
};

export default RedDot;
