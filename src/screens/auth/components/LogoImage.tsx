import React, { useEffect } from 'react';
import {
  Keyboard, Platform, StyleSheet,
} from 'react-native';
import Animated, {
  Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';
import images from '~/resources/images';
import { dimension } from '~/theme';

const LOGO_SIZE = 96;
const LOGO_SMALL_SIZE = 40;

const screenWidth = dimension.deviceWidth;
const MARGIN_LEFT_LOGO = -(screenWidth / 2 - 24 * 2);

const LogoImage = () => {
  const keyboardHeightValue = useSharedValue(0);
  const styles = createStyles();

  const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';

  const dismissEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

  useEffect(
    () => {
      const keyboardWillShowListener = Keyboard.addListener(
        showEvent, (event) => {
          if (event.endCoordinates?.height) {
            keyboardHeightValue.value = withTiming(
              1,
              {
                duration: 200,
              },
              () => {
                //
              },
            );
          }
        },
      );
      const keyboardWillHideListener = Keyboard.addListener(
        dismissEvent, () => {
          keyboardHeightValue.value = withTiming(
            0,
            {
              duration: 200,
            },
            () => {
              //
            },
          );
        },
      );

      return () => {
        keyboardWillHideListener.remove();
        keyboardWillShowListener.remove();
      };
    }, [],
  );

  const logoContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          keyboardHeightValue.value,
          [0, 1],
          [0, MARGIN_LEFT_LOGO],
          Extrapolate.CLAMP,
        ),
      },
    ],
    height: interpolate(
      keyboardHeightValue.value,
      [0, 1],
      [LOGO_SIZE, LOGO_SMALL_SIZE],
      Extrapolate.CLAMP,
    ),
    width: interpolate(
      keyboardHeightValue.value,
      [0, 1],
      [LOGO_SIZE, LOGO_SMALL_SIZE],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <Animated.Image
      testID="logo_image"
      source={images.logo_beincomm}
      style={[styles.alignCenter, logoContainerStyle]}
    />
  );
};

const createStyles = () => StyleSheet.create({
  alignCenter: { alignSelf: 'center' },
});

export default LogoImage;
