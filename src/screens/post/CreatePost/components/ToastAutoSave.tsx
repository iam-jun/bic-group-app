import {
  View, Animated, StyleSheet, Easing,
} from 'react-native';
import React, { useImperativeHandle, useRef } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Icon from '~/baseComponents/Icon';

import Text from '~/baseComponents/Text';
import { isAndroidAnimated } from '../helper';
import spacing from '~/theme/spacing';

interface Props {
  viewRef?: any;
  visible: boolean;
}

const ToastAutoSave = ({ viewRef, visible }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const toastHeightAnimated = useRef(new Animated.Value(0)).current;
  const isAnimated = isAndroidAnimated();

  const startAnimation = (
    height: number, toastHeight: number,
  ) => {
    toastHeightAnimated.stopAnimation();
    Animated.timing(
      toastHeightAnimated, {
        toValue: toastHeight,
        duration: toastHeight === 0 ? 0 : 50,
        useNativeDriver: false,
        easing: Easing.ease,
      },
    ).start();
  };

  useImperativeHandle(
    viewRef, () => ({
      startAnimation,
    }),
  );

  return (
    <Animated.View
      style={
        isAnimated ? { overflow: 'hidden', height: toastHeightAnimated } : {}
      }
    >
      {visible && (
        <View style={styles.toastAutoSave}>
          <Icon
            iconStyle={styles.iconToastAutoSave}
            style={styles.iconToastAutoSaveContainer}
            size={20}
            icon="iconSave"
            tintColor={theme.colors.neutral20}
          />
          <Text.BodySMedium useI18n color={theme.colors.neutral40}>
            post:auto_saved
          </Text.BodySMedium>
        </View>
      )}
    </Animated.View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    toastAutoSave: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.base,
    },
    iconToastAutoSaveContainer: { marginRight: spacing.margin.tiny },
    iconToastAutoSave: {
      padding: 2,
      borderRadius: 6,
    },
  });
};

export default ToastAutoSave;
