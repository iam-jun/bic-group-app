import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import Animated, { ZoomInEasyDown, ZoomOutEasyUp } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaintenanceSvg from '~/../assets/images/maintenance.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Text from '~/baseComponents/Text';
import useMaintenanceStore from '~/store/maintenance';
import { spacing } from '~/theme';

const Maintenance = () => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const { data, reset, actions } = useMaintenanceStore();
  const { enableMaintenance, estimatedCompletionTime = 120, startedAt = 1689218453002 } = data || {};

  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    actions.checkMaintenance();
    return () => {
      reset();
    };
  }, []);

  const onRefresh = async () => {
    setIsRefresh(true);
    await actions.checkMaintenance(true);
    setIsRefresh(false);
  };

  if (!enableMaintenance) {
    return null;
  }

  const textTime = getTextDate(startedAt, estimatedCompletionTime);

  return (
    <Animated.ScrollView
      testID="maintenance"
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.container}
      entering={ZoomInEasyDown}
      exiting={ZoomOutEasyUp}
      refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
    >
      <SVGIcon source={MaintenanceSvg} size={245} />
      <Text.H3 style={styles.text} color={colors.neutral60} useI18n>
        common:text_maintenance_title
      </Text.H3>
      <Text.BodyS style={[styles.text, styles.textContent]} color={colors.neutral40}>
        {t('common:text_maintenance_content')}
        {textTime}
      </Text.BodyS>
    </Animated.ScrollView>
  );
};

const getTextDate = (startedAt: number | string, minutes: number) => moment(new Date(startedAt)).add(minutes, 'minutes').format('HH:mm DD/MM/YYYY');

const createStyles = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: colors.white,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingHorizontal: spacing.padding.large,
      zIndex: 1,
    },
    contentContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      textAlign: 'center',
    },
    textContent: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default Maintenance;
