import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Animated, Keyboard, Platform, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '~/baseComponents/Text';
import { POLICY_URL } from '~/constants/url';
import spacing from '~/theme/spacing';
import { openInAppBrowser } from '~/utils/link';

const MAX_HEIGHT = 60;

const PrivacyAndTerms = () => {
  const insets = useSafeAreaInsets();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const [height, setHeight] = useState(MAX_HEIGHT);
  const animatedValue = new Animated.Value(MAX_HEIGHT);
  animatedValue.addListener((height) => {
    setHeight(height.value + (insets.bottom || 0));
  });
  const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';

  const dismissEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

  useEffect(
    () => {
      const keyboardWillShowListener = Keyboard.addListener(
        showEvent, (event) => {
          if (event.endCoordinates?.height) {
            Animated.timing(
              animatedValue, {
                toValue: 0,
                useNativeDriver: false,
                duration: 50,
              },
            ).start();
          }
        },
      );
      const keyboardWillHideListener = Keyboard.addListener(
        dismissEvent,
        () => {
          Animated.timing(
            animatedValue, {
              toValue: MAX_HEIGHT,
              useNativeDriver: false,
              duration: 250,
            },
          ).start();
        },
      );

      return () => {
        keyboardWillHideListener.remove();
        keyboardWillShowListener.remove();
      };
    }, [],
  );

  const onPrivacy = () => {
    openInAppBrowser(POLICY_URL);
  };

  return (
    <Animated.View style={[styles.container, { height }]}>
      <Text.BodyS color={colors.neutral30} useI18n>
        auth:text_agree_to_terms_sigin
      </Text.BodyS>
      <Text.BodySMedium onPress={onPrivacy} color={colors.blue50} useI18n>
        auth:text_privacy_terms
      </Text.BodySMedium>
    </Animated.View>
  );
};

const themeStyles = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.margin.extraLarge,
    paddingBottom: spacing.padding.extraLarge,
    alignSelf: 'center',
  },
});

export default PrivacyAndTerms;
