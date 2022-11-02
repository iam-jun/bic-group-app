import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';

type DescriptionSectionProps = {
  style?: StyleProp<ViewStyle>;
  description?: string;
};

const DescriptionSection: FC<DescriptionSectionProps> = ({
  description,
  style,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  if (!description) return null;

  return (
    <View style={[styles.container, style]}>
      <Text.BodyM color={colors.neutral40}>{description}</Text.BodyM>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.margin.small,
  },
});

export default DescriptionSection;
