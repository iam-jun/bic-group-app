import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Modal, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import useModal from '~/hooks/modal';

const LoadingModal = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {loading} = useModal();
  const {visible} = loading;

  return (
    <Modal visible={visible} contentContainerStyle={styles.root}>
      <View style={styles.logoContainer}>
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={images.logo_bein}
        />
        <ActivityIndicator
          size={72}
          style={styles.loadingIndicator}
          color={theme.colors.primary6}
        />
      </View>
      <Text.ButtonSmall>Loading...</Text.ButtonSmall>
    </Modal>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors, spacing} = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      paddingTop: insets.top,
      backgroundColor: colors.background,
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
    loadingIndicator: {
      position: 'absolute',
      top: -12, // = -IndicatorSize / 6, to make it center
      left: -12,
    },
  });
};

export default LoadingModal;
