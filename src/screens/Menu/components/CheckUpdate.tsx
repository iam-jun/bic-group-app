import React from 'react';
import {
  StyleSheet, StyleProp, ViewStyle, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import Button from '~/beinComponents/Button';

import { APP_ENV } from '~/configs/appConfig';
import useCodePushStore from '~/store/codePush';
import spacing from '~/theme/spacing';
import getEnv from '~/utils/env';

export interface CheckUpdateProps {
  style?: StyleProp<ViewStyle>;
}

const CheckUpdate = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const isProduction = getEnv('APP_ENV') === APP_ENV.PRODUCTION;

  if (isProduction) {
    return null;
  }

  const { actions, progress, status } = useCodePushStore() || {};
  const { receivedBytes = 0, totalBytes = 0 } = progress || {};

  const progressPercent = progress ? Math.round((receivedBytes * 100) / totalBytes) : 0;

  const onPress = () => {
    actions.sync();
  };

  return (
    <Button onPress={onPress} testID="check_update">
      <View style={styles.itemContainer}>
        <Icon tintColor={theme.colors.neutral20} icon="GaugeHigh" />
        <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>
          {'Update status: '}
        </Text.BodyMMedium>
        <Text.BodyM testID="menu_screen.check_update.text" style={styles.textStatus}>
          {status || 'Check now 🚀'}
          {!!progressPercent && `${progressPercent}%`}
        </Text.BodyM>
      </View>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
      alignItems: 'center',
      minHeight: 50,
    },
    textTitle: {
      marginLeft: spacing.margin.large,
      color: colors.neutral40,
    },
    textStatus: {
      flex: 1,
      color: colors.neutral40,
    },
  });
};

export default CheckUpdate;
