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
import images from '~/resources/images';
import LandingImg from '../../../../assets/images/landingpage.svg';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';

const Landing = () => {
  const theme: ITheme = useTheme() as ITheme;
  const {t, navigation} = useBaseHook();
  const styles = createStyle(theme);
  const dimensions = useWindowDimensions();

  const logo = images.logo_bein;
  const imgMaxWidth = 500;
  const imgPadding = 67;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  return (
    <ScreenWrapper isFullView style={styles.container}>
      {logo && <Image resizeMode="contain" style={styles.logo} source={logo} />}
      <View style={styles.contentContainer}>
        {/* @ts-ignore */}
        <SVGIcon source={LandingImg} size={imgSize} />
        <Text.H5 style={styles.title}>{t('auth:text_landing_title')}</Text.H5>
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

const createStyle = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.background,
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
