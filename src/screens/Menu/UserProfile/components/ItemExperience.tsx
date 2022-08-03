import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { IUserWorkExperience } from '~/interfaces/IAuth';
import { spacing } from '~/theme';
import { formatDate } from '~/utils/formatData';
import InfoItem from './InfoItem';

const ItemExperience = ({
  company,
  titlePosition,
  startDate,
  currentlyWorkHere,
  endDate,
  description,
  location,
}: IUserWorkExperience) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.titleCompany}>
        <View style={styles.titleLine} />
        <Text.SubtitleL color={theme.colors.neutral20}>
          {`${t('settings:text_work')} ${t('common:text_at')} `}
          <Text.SubtitleL>{company}</Text.SubtitleL>
        </Text.SubtitleL>
      </View>
      <InfoItem
        title="settings:text_title_position"
        value={titlePosition}
      />
      <InfoItem
        title="settings:text_title_division"
        value={location}
      />
      <InfoItem
        title="common:text_start_date"
        value={formatDate(
          startDate, 'MMM D, YYYY',
        )}
      />
      <InfoItem
        title="common:text_end_date"
        value={currentlyWorkHere
          ? `${t('common:text_to')} ${t('common:text_present')}`
          : endDate
            ? `${t('common:text_to')} ${formatDate(
              endDate,
              'MMM D, YYYY',
            )}`
            : ''}
      />
    </View>
  )
}

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.extraLarge,
    },
    titleCompany: {
      flexDirection: 'row',
      paddingBottom: spacing.padding.large,
    },
    titleLine: {
      width: 1,
      height: 22,
      backgroundColor: colors.neutral20,
      marginRight: spacing.padding.base,

    },
    infoItem: {
      paddingBottom: spacing.padding.large,
    },
  })
}

export default ItemExperience;
