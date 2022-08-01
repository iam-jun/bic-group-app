import React from 'react';
import {StyleSheet, View} from 'react-native';

import Text from '~/beinComponents/Text';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import NoNotificationFoundImg from '~/../assets/images/no_notification_found.svg';
import spacing from '~/theme/spacing';
import {useBaseHook} from '~/hooks';

const NoNotificationFound = () => {
  const {t} = useBaseHook();
  return (
    <View style={styles.root}>
      <SVGIcon
        // @ts-ignore
        source={NoNotificationFoundImg}
        width={145}
        height={150}
        tintColor="none"
      />
      <Text.BodyS>{t('notification:no_notification_found')}</Text.BodyS>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    paddingTop: (spacing.padding.extraLarge || 24) * 3,
  },
});

export default NoNotificationFound;
