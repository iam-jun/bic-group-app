import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Image from '~/beinComponents/Image';
import {spacing} from '~/theme';
import {useBaseHook} from '~/hooks';
import {authStack} from '~/configs/navigator';
import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import images from '~/resources/images';
import LandingImg from '../../../../assets/images/landing_page.svg';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';

const Landing = () => {
  const theme: ITheme = useTheme() as ITheme;
  const {t, navigation} = useBaseHook();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const styles = createStyle(theme, isPhone);

  const logo = images.logo_bein;
  const imgMaxWidth = 330;
  const imgPadding = theme.spacing.margin.base || 12;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  return (
    <ScreenWrapper isFullView style={styles.root}>
      <View style={styles.container}>
        {logo && (
          <Image resizeMode="contain" style={styles.logo} source={logo} />
        )}
        <View style={styles.contentContainer}>
          {/* @ts-ignore */}
          <SVGIcon source={LandingImg} size={imgSize} tintColor="none" />
          <Text.H5 style={styles.title}>{t('auth:text_landing_title')}</Text.H5>
        </View>
        <Button.Primary
          style={styles.button}
          onPress={() => navigation.navigate(authStack.login)}
          textVariant="h5">
          {t('auth:btn_landing_start')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme, isPhone: boolean) => {
  const insets = useSafeAreaInsets();
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      color: colors.primary6,
      marginTop: spacing.margin.large,
    },
    desc: {
      marginBottom: spacing.margin.tiny,
    },
    button: {
      marginTop: spacing.margin.big,
      marginBottom: 40,
    },
    logo: {
      width: 64,
      height: 64,
      marginTop: spacing.margin.big,
      marginBottom: 40,
      alignSelf: 'center',
    },
    img: {
      width: 305,
      height: 240,
      alignSelf: 'center',
    },
  });
};

export default Landing;
