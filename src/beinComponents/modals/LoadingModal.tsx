import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Modal,
} from 'react-native';
import LottieView from 'lottie-react-native';

import Image from '~/beinComponents/Image';
import images from '~/resources/images';

import { LottieFileLoading } from '~/resources/lottieJson';
import { useKeySelector } from '~/hooks/selector';

const LoadingModal = () => {
  const styles = themeStyles();

  const { loading } = useKeySelector('modal');
  const { visible } = loading;

  return (
    <Modal animationType="fade" visible={visible} style={styles.root}>
      <ImageBackground source={images.img_bg_sign_in} style={styles.background}>
        <View style={styles.logoContainer}>
          <LottieView
            style={styles.loadingIndicator}
            source={LottieFileLoading}
            autoPlay
            loop
          />
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={images.logo_beincomm_reverse}
          />
        </View>
      </ImageBackground>
    </Modal>
  );
};

const themeStyles = () => StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 50,
    position: 'absolute',
    top: -31,
  },
  loadingIndicator: {
    width: 74,
    height: 74,
    position: 'absolute',
  },
});

export default LoadingModal;
