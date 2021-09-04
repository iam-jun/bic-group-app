import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import NewFeatureImg from '~/../assets/images/new_feeature_grey.svg';
import i18n from 'i18next';

const NewFeature = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyle(theme);

  return (
    <View style={styles.root}>
      <SvgIcon
        // @ts-ignore
        source={NewFeatureImg}
        width={250}
        height={200}
        tintColor="none"
      />
      <Text.H6>
        {i18n.t('new_feature:text_we_are_developing_this_feature')}
      </Text.H6>
      <Text.Body>{i18n.t('new_feature:text_please_rate_how_urgent')}</Text.Body>
    </View>
  );
};

const themeStyle = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    root: {
      height: 415,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
  });
};

export default NewFeature;
