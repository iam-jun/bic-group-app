import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';

import { LottieFileLoading } from '~/resources/lottieJson';
import { useKeySelector } from '~/hooks/selector';

const LoadingModal = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const { loading } = useKeySelector('modal');
  const { visible } = loading;

  return (
    <Modal animationType="fade" visible={visible} style={styles.root}>
      <ImageBackground source={images.img_bg_sign_in} style={styles.background}>
        <View style={styles.logoContainer}>
          <LottieView
            source={LottieFileLoading}
            autoPlay
            loop
            style={styles.loadingIndicator}
          />
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={images.logo_beincomm}
          />
          <Text.ButtonS style={styles.textLoading}>Loading...</Text.ButtonS>
        </View>
      </ImageBackground>
    </Modal>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    background: {
      flex: 1,
      paddingTop: insets.top,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      alignSelf: 'center',
      width: 48,
      height: 48,
      borderRadius: 50,
      position: 'absolute',
      top: -142,
    },
    textLoading: {
      color: colors.white,
      position: 'absolute',
      bottom: 40,
    },
    loadingIndicator: {
      width: 235,
      height: 235,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default LoadingModal;
