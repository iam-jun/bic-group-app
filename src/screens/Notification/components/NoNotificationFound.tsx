import React from 'react';
import { StyleSheet, View } from 'react-native';
import i18next from 'i18next';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import NoNotificationFoundImg from '~/../assets/images/no_notification_found.svg';
import spacing from '~/theme/spacing';

const NoNotificationFound = () => {
  const theme: ExtendedTheme = useTheme();

  return (
    <View style={styles.root}>
      <SVGIcon
        source={NoNotificationFoundImg}
        width={145}
        height={150}
        tintColor="none"
      />
      <Text.H4 color={theme.colors.neutral60}>{i18next.t('notification:no_notification_found')}</Text.H4>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.padding.extraLarge,
  },
});

export default NoNotificationFound;
