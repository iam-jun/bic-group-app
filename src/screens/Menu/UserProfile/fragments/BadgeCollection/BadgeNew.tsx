import React from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import spacing, { borderRadius } from '~/theme/spacing';

interface BadgeNewProps {
  style?: StyleProp<ViewStyle>;
}

const BadgeNew = ({ style }: BadgeNewProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text.BadgeS color={colors.white} useI18n>common:text_new</Text.BadgeS>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.purple50,
      paddingVertical: spacing.padding.xTiny,
      paddingHorizontal: spacing.padding.xSmall,
      borderRadius: borderRadius.extraLarge,
    },
  });
};

export default BadgeNew;
