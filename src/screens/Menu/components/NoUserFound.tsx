import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import NoUserFoundImg from '../../../../assets/images/no_user_found.svg';
import Button from '~/beinComponents/Button';
import Header from '~/beinComponents/Header';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import { useRootNavigation } from '~/hooks/navigation';

import spacing from '~/theme/spacing';

const NoUserFound = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const goBack = () => {
    rootNavigation.goBack();
  };

  return (
    <ScreenWrapper testID="no_user_found" style={styles.root} isFullView>
      <Header title={i18next.t('error:no_profile_found_title')} />
      <View style={styles.mainContainer}>
        <SVGIcon
          source={NoUserFoundImg}
          width={250}
          height={200}
          tintColor="none"
        />
        <View style={styles.description}>
          <Text.H6 useI18n>error:no_profile_found_desc</Text.H6>
          <Text.BodyM useI18n>error:no_profile_found_second_desc</Text.BodyM>
        </View>
        <Button.Primary testID="no_user_found.go_back_btn" onPress={goBack} useI18n>
          error:button_back_to_safety
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    root: {
      backgroundColor: colors.neutral5,
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    description: {
      marginBottom: spacing.margin.large,
      alignItems: 'center',
    },
  });
};

export default NoUserFound;
