import React from 'react';
import {StyleSheet, View} from 'react-native';
import i18next from 'i18next';

import Text from '~/beinComponents/Text';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import NoNotificationFoundImg from '~/../assets/images/no_notification_found.svg';

const NoNotificationFound = () => {
  const styles = themeStyles();

  return (
    <View style={styles.root}>
      <SVGIcon
        // @ts-ignore
        source={NoNotificationFoundImg}
        width={250}
        height={200}
        tintColor="none"
      />
      <Text.H6>{i18next.t('error:no_group_found_desc')}</Text.H6>
      <Text.Subtitle>
        {i18next.t('error:no_group_found_second_desc')}
      </Text.Subtitle>
    </View>
  );
};

const themeStyles = () => {
  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default NoNotificationFound;
