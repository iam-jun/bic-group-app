import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/components/ScreenWrapper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import images from '~/resources/images';
import {Text} from '~/components';

const AppLoading = () => {
  const theme: IObject<any> = useTheme();
  const styles = themeStyles(theme);

  return (
    <ScreenWrapper testID="AppLoading" style={styles.container} isFullView>
      <Image
        resizeMode="contain"
        style={styles.logo}
        source={images.logo_bein}
      />
      <Text.H1>Bein</Text.H1>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    logo: {
      width: 120,
      height: 120,
    },
  });
};

export default AppLoading;
