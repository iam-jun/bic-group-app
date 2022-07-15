// This is for landing page with invitation
// copied from old landing

import React from 'react';
import {Image, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {useBaseHook} from '~/hooks';
import {authStack} from '~/configs/navigator';
import images from '~/resources/images';
import LandingImg from '../../../../assets/images/landing_page.svg';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';

import spacing from '~/theme/spacing';

const LandingWithInvitation = () => {
  const theme: ExtendedTheme = useTheme();
  const {t, navigation} = useBaseHook();
  const styles = themeStyles(theme);
  const dimensions = useWindowDimensions();

  const groupName = 'EVOLGROUP';
  const logo = images.logo_bein;

  const title = groupName
    ? t('auth:text_landing_title_group').replace('{0}', groupName)
    : t('auth:text_landing_title');
  const desc = groupName
    ? t('auth:text_landing_desc_group').replace('{0}', groupName)
    : '';

  const imgMaxWidth = 500;
  const imgPadding = 67;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  return (
    <ScreenWrapper isFullView style={styles.container}>
      {!!logo && (
        <Image resizeMode="contain" style={styles.logo} source={logo} />
      )}
      <View style={styles.contentContainer}>
        {/*@ts-ignore*/}
        <SVGIcon source={LandingImg} size={imgSize} />
        <Text.H5 style={styles.title}>{title}</Text.H5>
        {!!desc && <Text.BodyS style={styles.desc}>{desc}</Text.BodyS>}
      </View>
      <Button.Primary
        style={styles.button}
        onPress={() => navigation.navigate(authStack.login)}
        textVariant="h5">
        {t('auth:btn_landing_start')}
      </Button.Primary>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.white,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      marginVertical: spacing.margin.tiny,
    },
    desc: {
      marginBottom: spacing.margin.tiny,
    },
    button: {
      marginTop: spacing.margin.big,
      marginBottom: 80,
    },
    logo: {
      width: 64,
      height: 64,
      marginTop: spacing.margin.big,
      marginBottom: 40,
      alignSelf: 'center',
    },
  });
};

export default LandingWithInvitation;
