import React from 'react';
import {
  Dimensions, ImageBackground, View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '~/resources/images';

import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import BackgroundEntries1 from '../../../../assets/images/sign_in_bg_entries_1.svg';
import BackgroundEntries2 from '../../../../assets/images/sign_in_bg_entries_2.svg';

const screenWidth = Dimensions.get('window').width;

const BackgroundComponent = ({ children }: {children: React.ReactNode}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <ImageBackground source={images.img_bg_sign_in} style={styles.background}>
      <View style={styles.bgEntries1}>
        <SVGIcon
          source={BackgroundEntries1}
          width={164}
          height={205}
          tintColor="none"
        />
      </View>
      <View pointerEvents="none" style={styles.bgEntries2}>
        <SVGIcon
          source={BackgroundEntries2}
          width={122}
          height={163}
          tintColor="none"
        />
      </View>
      {children}
    </ImageBackground>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    background: {
      flex: 1,
      paddingTop: insets.top,
      alignContent: 'center',
      alignItems: 'center',
    },
    bgEntries1: {
      position: 'absolute', right: 0, top: 0, flex: 1,
    },
    bgEntries2: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: screenWidth,
    },
  });
};

export default BackgroundComponent;
