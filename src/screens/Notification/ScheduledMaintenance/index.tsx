import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import MaintenanceSvg from '~/../assets/images/maintenance.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import { IRouteParams } from '~/interfaces/IRouter';
import { useBaseHook } from '~/hooks';
import { sizes } from '~/theme/dimension';
import Markdown from '~/beinComponents/Markdown';

const ScheduledMaintenance: FC<IRouteParams> = (props) => {
  const { t } = useBaseHook();

  const { params } = props.route;
  const { duration = 0, startAt = '' } = params?.maintenanceInfo || {};
  const textDuration = getTextDurations(duration, t);
  const textDate = getTextDate(startAt);

  const content = t('notification:content_scheduled_maintenance_downtime').replace(
    '(startAt)', textDate,
  ).replace(
    '(duration)', textDuration,
  );

  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header
        title="common:btn_go_back"
        useI18n
        style={styles.header}
      />
      <View style={styles.content}>
        <View style={styles.image}>
          <SVGIcon source={MaintenanceSvg} size={120} />
        </View>
        <Text.H3 useI18n style={styles.title}>
          notification:text_scheduled
        </Text.H3>
        <Text.ParagraphS>
          {' '}
        </Text.ParagraphS>
        <Markdown value={content} />
        <Text.ParagraphS useI18n style={{ fontWeight: 'bold' }}>
          notification:text_bic_team
        </Text.ParagraphS>
      </View>
    </View>
  );
};

const getTextDate = (inputDate: string) => {
  const dateObj = new Date(inputDate);
  const offset = 7 * 60;

  const hours = (dateObj.getUTCHours() + offset / 60).toString().padStart(2, '0');
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
  const day = dateObj.getUTCDate().toString().padStart(2, '0');
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getUTCFullYear();

  return `${hours}:${minutes} (UTC+7) ${day}/${month}/${year}`;
};

const getTextDurations = (duration: number, t: any) => {
  const hoursDuration = duration / 60;
  const minutesDuration = duration % 60;
  let textDuration = '';
  if (hoursDuration <= 1) {
    textDuration = `${duration} ${t?.('common:time:minutes')}`;
  }
  if (hoursDuration > 1 && minutesDuration > 0) {
    textDuration = `${Math.floor(hoursDuration) + 1} ${t?.('common:time:hours')}`;
  }
  return textDuration;
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.gray5,
      paddingVertical: 0,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.margin.tiny,
      fontSize: sizes.mdH2,
    },
    image: {
      alignItems: 'center',
    },
  });
};

export default ScheduledMaintenance;
