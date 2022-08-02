import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';

interface Props {
  title: string;
  children: React.ReactNode
}

const InfoSection = ({ title, children }: Props) => (
  <View style={styles.container}>
    <Text.H4 useI18n style={styles.title}>{title}</Text.H4>
    {children}
  </View>
)
const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.base,
    marginTop: spacing.margin.large,
  },
  title: {
    marginBottom: spacing.margin.large,
  },
});

export default InfoSection;
