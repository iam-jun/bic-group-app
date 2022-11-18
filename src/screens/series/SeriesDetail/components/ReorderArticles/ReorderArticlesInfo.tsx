import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';

const ReorderArticlesInfo = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.title}>
      <Icon icon="CircleInfo" tintColor={theme.colors.neutral20} size={18} />
      <Text.BodyS color={theme.colors.neutral40} style={styles.textInfo} useI18n>
        series:text_info_reorder
      </Text.BodyS>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    title: {
      flexDirection: 'row',
      padding: spacing.padding.base,
      alignItems: 'center',
      marginBottom: spacing.margin.tiny,
      backgroundColor: colors.neutral1,
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.large,
    },
    textInfo: {
      marginHorizontal: spacing.margin.small,
    },
  });
};

export default ReorderArticlesInfo;
