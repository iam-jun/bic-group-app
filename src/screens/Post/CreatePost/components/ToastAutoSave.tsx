import {View, Animated, StyleSheet, Easing} from 'react-native';
import React, {useImperativeHandle, useRef} from 'react';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import {isAndroidAnimated} from '../helper';
import spacing from '~/theme/spacing';

interface Props {
  viewRef: any;
  visible: boolean;
}

const ToastAutoSave = ({viewRef, visible}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const toastHeightAnimated = useRef(new Animated.Value(0)).current;
  const isAnimated = isAndroidAnimated();

  const startAnimation = (height: number, toastHeight: number) => {
    toastHeightAnimated.stopAnimation();
    Animated.timing(toastHeightAnimated, {
      toValue: toastHeight,
      duration: toastHeight === 0 ? 0 : 50,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  useImperativeHandle(viewRef, () => ({
    startAnimation,
  }));

  return (
    <Animated.View
      style={
        isAnimated ? {overflow: 'hidden', height: toastHeightAnimated} : {}
      }>
      {visible && (
        <View style={styles.toastAutoSave}>
          <Icon
            isButton
            iconStyle={styles.iconToastAutoSave}
            style={styles.iconToastAutoSaveContainer}
            size={18}
            icon="Save"
            tintColor={theme.colors.textSecondary}
          />
          <Text.BodyS useI18n style={styles.textToastAutoSave}>
            post:auto_saved
          </Text.BodyS>
        </View>
      )}
    </Animated.View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    toastAutoSave: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.base,
    },
    iconToastAutoSaveContainer: {marginRight: spacing.margin.tiny},
    iconToastAutoSave: {
      padding: 2,
      borderRadius: 6,
      backgroundColor: colors.iconTintReversed,
    },
    textToastAutoSave: {color: colors.textSecondary},
  });
};

export default ToastAutoSave;
