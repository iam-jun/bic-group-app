import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import NewFeatureImg from '~/../assets/images/new_feeature_grey.svg';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import spacing from '~/theme/spacing';

const NewFeature = () => {
  const theme = useTheme() as ExtendedTheme;
  const styles = themeStyle(theme);
  // const [showRating, setShowRating] = useState<boolean>(true);
  //
  // const onRatingPress = () => {
  //   setShowRating(false);
  // };

  // const renderRatingSection = () => {
  //   return (
  //     <View style={styles.buttonsContainer}>
  //       <Button.Secondary
  //         useI18n
  //         style={styles.button}
  //         onPress={onRatingPress}
  //         color={theme.colors.purple10}>
  //         new_feature:button_I_want_it_now
  //       </Button.Secondary>
  //       <Button.Secondary
  //         style={styles.button}
  //         useI18n
  //         onPress={onRatingPress}
  //         color={theme.colors.purple5}>
  //         new_feature:button_I_can_wait
  //       </Button.Secondary>
  //       <Button.Secondary style={styles.button} useI18n onPress={onRatingPress}>
  //         new_feature:button_not_really_need
  //       </Button.Secondary>
  //     </View>
  //   );
  // };

  // const renderContent = () => {
  //   const header = showRating
  //     ? 'new_feature:text_we_are_developing_this_feature'
  //     : 'new_feature:text_thanks_for_your_feedback';
  //   const body = showRating
  //     ? 'new_feature:text_please_rate_how_urgent'
  //     : 'new_feature:text_we_will_notify_you';
  //   return (
  //     <>
  //       <Text.H6 useI18n>{header}</Text.H6>
  //       <Text.Body useI18n>{body}</Text.Body>
  //     </>
  //   );
  // };

  return (
    <ScreenWrapper style={styles.screenContainer} isFullView>
      <Header title="new_feature:title" titleTextProps={{useI18n: true}} />
      <View style={styles.body}>
        <SvgIcon
          // @ts-ignore
          source={NewFeatureImg}
          width={250}
          height={200}
          tintColor="none"
        />
        <Text.H6 useI18n>
          new_feature:text_we_are_developing_this_feature
        </Text.H6>
        <Text.Body useI18n>new_feature:text_we_will_notify_you</Text.Body>
      </View>
    </ScreenWrapper>
  );

  // Keep the returning below for the future use, replace the current one with this one
  // return (
  //   <View style={styles.root}>
  //     <SvgIcon
  //       // @ts-ignore
  //       source={NewFeatureImg}
  //       width={250}
  //       height={200}
  //       tintColor="none"
  //     />
  //     {renderContent()}
  //     {showRating && renderRatingSection()}
  //   </View>
  // );
};

const themeStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;

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
