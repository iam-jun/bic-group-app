import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';

interface TitleComponentProps {
  title: string;
  isOptional?: boolean;
}

const TitleComponent = ({ title, isOptional }: TitleComponentProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.container}>
      {!!title && (
      <Text.BodyM>
        <Text.BodyM>{t(title)}</Text.BodyM>
        {isOptional && <Text.BodyM color={colors.neutral20}>{` (${t('settings:optional')})`}</Text.BodyM>}
      </Text.BodyM>
      )}
    </View>
  );
};

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
