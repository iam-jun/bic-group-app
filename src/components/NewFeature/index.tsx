import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import SvgIcon from '~/baseComponents/Icon/SvgIcon';
import NewFeatureImg from '../../../assets/images/new_feeature_grey.svg';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import spacing from '~/theme/spacing';

const NewFeature = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyle(theme);

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      <Header title="new_feature:title" titleTextProps={{ useI18n: true }} />
      <View style={styles.body}>
        <SvgIcon
          source={NewFeatureImg}
          width={250}
          height={200}
          tintColor="none"
        />
        <Text.H6 useI18n>
          new_feature:text_we_are_developing_this_feature
        </Text.H6>
        <Text.BodyM useI18n>new_feature:text_we_will_notify_you</Text.BodyM>
      </View>
    </ScreenWrapper>
  );
};

const themeStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.white,
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonsContainer: {
      flex: 1,
      width: '100%',
      maxWidth: 271,
      marginTop: spacing.margin.extraLarge,
    },
    button: {
      marginVertical: spacing.margin.tiny,
    },
  });
};

export default NewFeature;
