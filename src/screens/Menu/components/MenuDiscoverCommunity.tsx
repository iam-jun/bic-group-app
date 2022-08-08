import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

export interface MenuDiscoverCommunityProps {
  style?: StyleProp<ViewStyle>;
}

const MenuDiscoverCommunity: FC<MenuDiscoverCommunityProps> = ({ style }: MenuDiscoverCommunityProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Text.SubtitleS useI18n>menu:title_your_community</Text.SubtitleS>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default MenuDiscoverCommunity;
