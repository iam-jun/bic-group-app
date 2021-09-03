import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';

const NoNotificationFound = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.root}>
      <Text.H6>{i18next.t('error:no_group_found_desc')}</Text.H6>
      <Text.Subtitle>
        {i18next.t('error:no_group_found_second_desc')}
      </Text.Subtitle>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.placeholder,
    },
  });
};

export default NoNotificationFound;
