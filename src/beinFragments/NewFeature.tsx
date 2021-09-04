import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import NewFeatureImg from '~/../assets/images/new_feeature_grey.svg';
import Button from '~/beinComponents/Button';

const NewFeature = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyle(theme);

  const renderRatingSection = () => {
    return (
      <View style={styles.buttonsContainer}>
        <Button.Secondary useI18n>
          new_feature:button_I_want_it_now
        </Button.Secondary>
        <Button.Secondary style={styles.button} useI18n>
          new_feature:button_I_can_wait
        </Button.Secondary>
        <Button.Secondary style={styles.button} useI18n>
          new_feature:button_not_really_need
        </Button.Secondary>
      </View>
    );
  };
  return (
    <View style={styles.root}>
      <SvgIcon
        // @ts-ignore
        source={NewFeatureImg}
        width={250}
        height={200}
        tintColor="none"
      />
      <Text.H6 useI18n>new_feature:text_we_are_developing_this_feature</Text.H6>
      <Text.Body useI18n>new_feature:text_please_rate_how_urgent</Text.Body>
      {renderRatingSection()}
    </View>
  );
};

const themeStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    root: {
      height: 415,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    buttonsContainer: {
      marginTop: spacing.margin.extraLarge,
    },
    button: {
      marginVertical: spacing.margin.tiny,
    },
  });
};

export default NewFeature;
