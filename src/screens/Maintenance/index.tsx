import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { ZoomInEasyDown, ZoomOutEasyUp } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaintenanceSvg from '~/../assets/images/maintenance.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Text from '~/baseComponents/Text';
import Markdown from '~/beinComponents/Markdown';
import useMaintenanceStore from '~/store/maintenance';
import { spacing } from '~/theme';

const Maintenance = () => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const { data, reset, actions } = useMaintenanceStore();
  const { enableMaintenance, estimatedCompletionTime, startedAt } = data || {};

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
  const content = t('common:text_maintenance_content').replace('(endAt)', textTime);

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
      <Text.ParagraphS>
        {' '}
      </Text.ParagraphS>
      <View style={styles.textContentContainer}>
        <Markdown value={content} />
        <Text.BodyMMedium useI18n>
          notification:text_bic_team
        </Text.BodyMMedium>
      </View>
    </Animated.ScrollView>
  );
};

const getTextDate = (startedAt: number | string, minutes: number) => {
  const dateEndAt = moment(new Date(startedAt)).add(minutes, 'minutes');
  const hourEndAt = moment(dateEndAt).format('HH:mm');
  const dateEndAtString = moment(dateEndAt).format('DD/MM/YYYY');
  const utcEndAt = moment(dateEndAt).format('Z').slice(1, 3);

  return `${hourEndAt} (UTC+${utcEndAt}) ${dateEndAtString}`;
};

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
      zIndex: 1,
    },
    contentContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      textAlign: 'center',
      marginBottom: spacing.margin.tiny,
    },
    textContent: {
      marginTop: spacing.margin.tiny,
    },
    textContentContainer: {
      justifyContent: 'flex-start',
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default Maintenance;
