import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

interface TitleComponentProps {
  title: string;
}

const TitleComponent = ({ title }: TitleComponentProps) => (
  <View style={styles.container}>
    {!!title && <Text.BodyM useI18n>{title}</Text.BodyM>}
  </View>
);

export default TitleComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: spacing.padding.small,
  },
  iconStyle: {
    marginRight: spacing.margin.small,
  },
});
