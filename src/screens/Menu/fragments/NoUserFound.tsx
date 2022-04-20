import React from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import Button from '~/beinComponents/Button';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import NoUserFoundImg from '~/../assets/images/no_user_found.svg';
import {deviceDimensions} from '~/theme/dimension';

const NoUserFound = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const navigation = useNavigation();

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  return (
    <ScreenWrapper
      testID="user_profile.not_found"
      style={styles.root}
      isFullView>
      <Header
        title={i18next.t('error:no_profile_found_title')}
        hideBackOnLaptop
      />
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
        {!isLaptop && (
          <Button.Primary onPress={() => navigation.goBack()} useI18n>
            error:button_back_to_safety
          </Button.Primary>
        )}
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    root: {
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.placeholder,
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
