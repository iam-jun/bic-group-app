import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';

interface Props {
  testID?: string;
  title: string;
  rightTitle?: ReactElement;
  children: React.ReactNode;
}

const InfoSection = ({
  testID, title, rightTitle, children,
}: Props) => (
  <View testID={testID || 'info_section'}>
    <View style={styles.row}>
      <Text.H4 testID="info_section.title" useI18n>
        {title}
      </Text.H4>
      {rightTitle}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.margin.large,
  },
});

export default InfoSection;
