import React from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {ActivityIndicator, Modal, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';

import useModal from '~/hooks/modal';
import spacing from '~/theme/spacing';

const LoadingModal = () => {
  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
  const styles = themeStyles(theme);

  const {loading} = useModal();
  const {visible} = loading;

  return (
    <Modal visible={visible} contentContainerStyle={styles.root}>
      <ImageBackground source={images.img_bg_sign_in} style={styles.background}>
        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={images.logo_beincomm}
          />
          <ActivityIndicator
            size={72}
            style={styles.loadingIndicator}
            color={theme.colors.white}
          />
        </View>
        <Text.ButtonSmall style={styles.textLoading}>
          Loading...
        </Text.ButtonSmall>
      </ImageBackground>
    </Modal>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;

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
      marginBottom: spacing.margin.big,
    },
    logo: {
      alignSelf: 'center',
      width: 48,
      height: 48,
      borderRadius: 50,
    },
    textLoading: {
      color: colors.white,
    },
    loadingIndicator: {
      position: 'absolute',
      top: -12, // = -IndicatorSize / 6, to make it center
      left: -12,
    },
  });
};

export default LoadingModal;
