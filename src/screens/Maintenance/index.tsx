import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl, SafeAreaView, ScrollView, StyleSheet,
} from 'react-native';
import MaintenanceSvg from '~/../assets/images/maintenance.svg';
import streamApi from '~/api/StreamApi';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Text from '~/baseComponents/Text';
import { useRootNavigation } from '~/hooks/navigation';
import showToastError from '~/store/helper/showToastError';
import useMaintenanceStore from '~/store/maintenance';
import { spacing } from '~/theme';
import { formatDate } from '~/utils/formatter';

const Maintenance = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const { data, reset } = useMaintenanceStore();

  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(
    () => () => {
      reset();
    },
    [],
  );

  const onRefresh = async () => {
    setIsRefresh(true);
    await callAnyApi();
    setIsRefresh(false);
  };

  const callAnyApi = async () => {
    try {
      const response = await streamApi.getNewsfeed({});
      if (response && !response?.enableMaintenance) {
        rootNavigation.navigate('home');
      }
    } catch (error) {
      showToastError(error);
    }
  };

  const convertTime = () => moment(data?.startedAt).add(Number(data?.estimatedCompletionTime), 'minutes').utcOffset('+07:00');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        testID="maintenance"
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.content}
        refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
      >
        <SVGIcon source={MaintenanceSvg} size={245} />
        <Text.H3 style={styles.text} color={colors.neutral60} useI18n>
          common:text_maintenance_title
        </Text.H3>
        <Text.BodyS style={[styles.text, styles.textContent]} color={colors.neutral40}>
          {t('common:text_maintenance_content')}
          {formatDate(convertTime(), 'HH:mm DD/MM/YYYY')}
        </Text.BodyS>
      </ScrollView>
    </SafeAreaView>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    contentContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingHorizontal: spacing.padding.large,
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
