import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';

type SectionContainerProps = {
    title: string;
};

const SectionContainer: FC<SectionContainerProps> = ({ title, children }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Text.H3 useI18n color={colors.neutral60}>
        {title}
      </Text.H3>
      <ViewSpacing height={spacing.margin.large} />
      {children}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: 20,
      paddingBottom: spacing.padding.base,
      backgroundColor: colors.white,
    },
  });
};

export default SectionContainer;
