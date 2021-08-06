import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Container} from '~/components';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {spacing} from '~/theme';
import {useBaseHook} from '~/hooks';
import {authStack} from '~/configs/navigator';
// import {ITheme} from "~/theme/interfaces";

const Landing = () => {
  // const theme: ITheme = useTheme() as ITheme;
  const {t, navigation} = useBaseHook();
  const styles = createStyle();

  const {logo, img}: any = {
    logo: 'https://i.ibb.co/THjnH3g/landing-logo.png',
    img: 'https://i.ibb.co/XZ98dD0/landing-img.png',
  };

  return (
    <ScreenWrapper isFullView style={styles.container}>
      {!!logo && (
        <Image resizeMode="contain" style={styles.logo} source={{uri: logo}} />
      )}
      <Container fluid style={styles.contentContainer}>
        <Image resizeMode="contain" style={styles.img} source={{uri: img}} />
        <Text.H5 style={styles.title}>{t('auth:text_landing_title')}</Text.H5>
      </Container>
      <Button.Primary
        style={styles.button}
        onPress={() => navigation.navigate(authStack.login)}
        textVariant="h5">
        {t('auth:btn_landing_start')}
      </Button.Primary>
    </ScreenWrapper>
  );
};

const createStyle = () => {
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      paddingTop: insets.top,
      paddingHorizontal: spacing.margin.big,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      marginVertical: spacing.margin.extraLarge,
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
