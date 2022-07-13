import React, {useEffect} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {spacing} from '~/theme';
import {useBaseHook} from '~/hooks';
import {authStack} from '~/configs/navigator';
import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import LandingImg from '../../../../assets/images/landing_page.svg';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import useAuth from '~/hooks/auth';
import {rootSwitch} from '~/router/stack';
import images from '~/resources/images';
import Image from '~/beinComponents/Image';

const LOGO_SIZE = 72;

const Landing = () => {
  const {user} = useAuth();
  const isFocused = useIsFocused();

  const theme: ITheme = useTheme() as ITheme;
  const {t, navigation} = useBaseHook();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;

  const styles = createStyle(theme, isPhone, insets);

  const IMAGE_WIDTH = (dimensions.width * 26) / 39;
  const IMAGE_HEIGHT = (IMAGE_WIDTH * 277) / 260;
  const logo = images.logo_beincomm;

  useEffect(() => {
    isFocused && user && navigation.replace(rootSwitch.mainStack);
  }, [isFocused]);

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
          <Text.Body>{t('auth:text_landing_logo_description')}</Text.Body>
        </View>
        <View style={styles.contentContainer}>
          {/* @ts-ignore */}
          <SVGIcon
            source={LandingImg}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            tintColor="none"
          />
          <Text variant="subtitle" style={styles.title}>
            {t('auth:text_landing_title')}
          </Text>
        </View>
        <Button.Primary
          testID="landing.start"
          style={styles.button}
          onPress={() => navigation.navigate(authStack.login)}
          textVariant="h5">
          {t('auth:btn_landing_start')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme, isPhone: boolean, insets: EdgeInsets) => {
  const {colors} = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.background,
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
      color: colors.text,
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
