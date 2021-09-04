import React, {useState} from 'react';
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
  const [showRating, setShowRating] = useState<boolean>(true);

  const onRatingPress = () => {
    setShowRating(false);
  };

  const renderRatingSection = () => {
    return (
      <View style={styles.buttonsContainer}>
        <Button.Secondary
          useI18n
          style={styles.button}
          onPress={onRatingPress}
          color={theme.colors.primary3}>
          new_feature:button_I_want_it_now
        </Button.Secondary>
        <Button.Secondary
          style={styles.button}
          useI18n
          onPress={onRatingPress}
          color={theme.colors.primary2}>
          new_feature:button_I_can_wait
        </Button.Secondary>
        <Button.Secondary style={styles.button} useI18n onPress={onRatingPress}>
          new_feature:button_not_really_need
        </Button.Secondary>
      </View>
    );
  };

  const renderContent = () => {
    const header = showRating
      ? 'new_feature:text_we_are_developing_this_feature'
      : 'new_feature:text_thanks_for_your_feedback';
    const body = showRating
      ? 'new_feature:text_please_rate_how_urgent'
      : 'new_feature:text_we_will_notify_you';
    return (
      <>
        <Text.H6 useI18n>{header}</Text.H6>
        <Text.Body useI18n>{body}</Text.Body>
      </>
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
      {renderContent()}
      {showRating && renderRatingSection()}
    </View>
  );
};

const themeStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
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
