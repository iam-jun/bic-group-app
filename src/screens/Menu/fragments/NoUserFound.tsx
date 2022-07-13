import {useNavigation} from '@react-navigation/native';
import i18next from 'i18next';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import NoUserFoundImg from '~/../assets/images/no_user_found.svg';
import Button from '~/beinComponents/Button';
import Header from '~/beinComponents/Header';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';

import spacing from '~/theme/spacing';

const NoUserFound = () => {
  const theme = useTheme() as ExtendedTheme;
  const styles = themeStyles(theme);
  const navigation = useNavigation();

  return (
    <ScreenWrapper
      testID="user_profile.not_found"
      style={styles.root}
      isFullView>
      <Header title={i18next.t('error:no_profile_found_title')} />
      <View style={styles.mainContainer}>
        <SVGIcon
          // @ts-ignore
          source={NoUserFoundImg}
          width={250}
          height={200}
          tintColor="none"
        />
        <View style={styles.description}>
          <Text.H6 useI18n>error:no_profile_found_desc</Text.H6>
          <Text.Body useI18n>error:no_profile_found_second_desc</Text.Body>
        </View>
        <Button.Primary onPress={() => navigation.goBack()} useI18n>
          error:button_back_to_safety
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;
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
