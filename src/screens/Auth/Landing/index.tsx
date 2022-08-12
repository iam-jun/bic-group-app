import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtendedTheme, useIsFocused, useTheme } from '@react-navigation/native';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';
import { authStack } from '~/configs/navigator';
import { deviceDimensions } from '~/theme/dimension';
import LandingImg from '../../../../assets/images/landing_page.svg';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import useAuth from '~/hooks/auth';
import { rootSwitch } from '~/router/stack';
import images from '~/resources/images';
import Image from '~/beinComponents/Image';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';

const LOGO_SIZE = 72;

const Landing = () => {
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const styles = createStyle(
    theme, isPhone,
  );

  const IMAGE_WIDTH = (dimensions.width * 26) / 39;
  const IMAGE_HEIGHT = (IMAGE_WIDTH * 277) / 260;
  const logo = images.logo_beincomm;

  useEffect(
    () => {
      isFocused && user && rootNavigation.replace(rootSwitch.mainStack);
    }, [isFocused],
  );

  return (
    <ScreenWrapper isFullView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          {logo && (
            <Image resizeMode="contain" style={styles.logo} source={logo} />
          )}

          <Text.H4 style={styles.logoTitle}>
            {t('auth:text_landing_logo_title')}
          </Text.H4>
          <Text.BodyM>{t('auth:text_landing_logo_description')}</Text.BodyM>
        </View>
        <View style={styles.contentContainer}>
          <SVGIcon
            source={LandingImg}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            tintColor="none"
          />
          <Text.BodyS style={styles.title}>
            {t('auth:text_landing_title')}
          </Text.BodyS>
        </View>
        <Button.Primary
          testID="landing.start"
          style={styles.button}
          onPress={() => rootNavigation.navigate(authStack.login)}
          textVariant="h5"
        >
          {t('auth:btn_landing_start')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (
  theme: ExtendedTheme, isPhone: boolean,
) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      alignContent: 'center',
      width: '100%',
      maxWidth: 600,
      maxHeight: !isPhone ? 754 : undefined,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      color: colors.neutral80,
      marginTop: -spacing.margin.extraLarge,
    },
    desc: {
      marginBottom: spacing.margin.tiny,
    },
    button: {
      marginTop: spacing.margin.big,
      marginBottom: 40,
    },
    logoContainer: {
      marginTop: spacing.margin.big,
      marginBottom: spacing.margin.extraLarge * 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      marginBottom: spacing.margin.extraLarge,
    },
    logoTitle: {
      marginBottom: spacing.margin.tiny,
    },
  });
};

export default Landing;
