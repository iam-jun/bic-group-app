import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

import Image from '~/components/Image';
import images from '~/resources/images';
import { LottieFileLoading } from '~/resources/lottieJson';
import useModalStore from '~/store/modal';

const LoadingModal = () => {
  const styles = themeStyles();

  const loadingModal = useModalStore((state) => state.loadingModal);

  if (!loadingModal) return null;

  return (
    <Animated.View style={styles.container} entering={FadeInUp} exiting={FadeOutDown}>
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
    </Animated.View>
  );
};

const themeStyles = () => StyleSheet.create({
  container: {
    zIndex: 99,
    position: 'absolute',
    width: '100%',
    height: '100%',
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
  },
  loadingIndicator: {
    width: 74,
    height: 74,
    position: 'absolute',
  },
});

export default LoadingModal;
