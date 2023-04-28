import {
  StyleSheet, View, StyleProp, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const DeactivatedView = ({ style = {} }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;
  return (
    <View style={[styles.container, style]} testID="deactivated_view">
      <Text.BodyXS color={colors.grey40} useI18n>
        common:text_deactivated
      </Text.BodyXS>
    </View>
  );
};

export default DeactivatedView;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      backgroundColor: colors.grey10,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.tiny,
      borderRadius: 100,
    },
  });
};
