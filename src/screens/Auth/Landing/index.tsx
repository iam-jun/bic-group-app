import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';

import {Container, ScreenWrapper, Text} from '~/components';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import {useBaseHook} from '~/hooks';
import {authStack} from '~/configs/navigator';
import Button from '~/beinComponents/Button';

const Landing = () => {
  const theme: IObject<any> = useTheme();
  const {t, navigation} = useBaseHook();
  const styles = themeStyles(theme);

  const {logo, img, groupName}: any = {
    groupName: 'EVOLGROUP',
    logo: 'https://i.ibb.co/THjnH3g/landing-logo.png',
    img: 'https://i.ibb.co/b5MRfBj/landing-img-group.png',
  };

  const title = groupName
    ? t('auth:text_landing_title_group').replace('{0}', groupName)
    : t('auth:text_landing_title');
  const desc = groupName
    ? t('auth:text_landing_desc_group').replace('{0}', groupName)
    : '';

  return (
    <ScreenWrapper isFullView style={styles.container}>
      {!!logo && (
        <Image resizeMode="contain" style={styles.logo} source={{uri: logo}} />
      )}
      <Container fluid style={styles.contentContainer}>
        <Image resizeMode="contain" style={styles.img} source={{uri: img}} />
        <Text h4 bold style={styles.title}>
          {title}
        </Text>
        {!!desc && <Text style={styles.desc}>{desc}</Text>}
      </Container>
      <Button.Primary
        style={styles.button}
        onPress={() => navigation.navigate(authStack.login)}>
        {t('auth:btn_landing_start')}
      </Button.Primary>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;
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
    img: {
      width: 305,
      height: 240,
      alignSelf: 'center',
    },
  });
};

export default Landing;
