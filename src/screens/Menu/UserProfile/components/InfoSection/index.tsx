import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';

interface Props {
  testID?:string;
  title: string;
  children: React.ReactNode
}

const InfoSection = ({ testID, title, children }: Props) => (
  <View testID={testID || 'info_section'} style={styles.container}>
    <Text.H4 testID="info_section.title" useI18n style={styles.title}>{title}</Text.H4>
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
