import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import moment from 'moment';
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
  const { duration = 0, startAt = 0 } = params?.maintenanceInfo || {};
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
        <Text.H3 testID="scheduled_maintenance.title" useI18n style={styles.title}>
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

const getTextDate = (inputDate: number) => {
  const hourStartAt = moment(inputDate).format('HH:mm');
  const dateStartAt = moment(inputDate).format('DD/MM/YYYY');
  const utcStartAt = moment(inputDate).format('Z').slice(1, 3);

  return `${hourStartAt} (UTC+${utcStartAt}) ${dateStartAt}`;
};

const getTextDurations = (duration: number, t: any) => {
  const hoursDuration = duration / 60;
  const minutesDuration = duration % 60;
  let textDuration = '';
  if (hoursDuration <= 1) {
    textDuration = `${duration} ${t?.('common:time:minutes')}`;
  }
  if (hoursDuration > 1) {
    const plusHour = minutesDuration > 0 ? 1 : 0;
    textDuration = `${Math.floor(hoursDuration) + plusHour} ${t?.('common:time:hours')}`;
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
