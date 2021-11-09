import React, {useEffect, useRef} from 'react';
import {StyleSheet, Platform, Animated} from 'react-native';
import {useTheme} from 'react-native-paper';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';

interface Props {
  visible: boolean;
  onDownPress: () => void;
}

const DownButton = ({visible, onDownPress}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const translateYAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    /**
     * if (visible) fade in and move up
     * else fade out and move down.
     * FYI, 72 =  32            + 40
     *            from bottom     button's size
     * and -72 is reverse of the Y axis direction
     */
    const newTranslateY = visible ? -72 : 0;
    const newOpacity = visible ? 1 : 0;
    const duration = 300;

    Animated.timing(translateYAnimation, {
      toValue: newTranslateY,
      useNativeDriver: false,
      duration,
    }).start();
    Animated.timing(fadeAnimation, {
      toValue: newOpacity,
      useNativeDriver: false,
      duration,
    }).start();
  }, [visible]);

  return (
    <ButtonWrapper onPress={onDownPress}>
      <Animated.View
        nativeID="down-button"
        style={[
          styles.container,
          Platform.OS !== 'web' && styles.shadow,
          {
            opacity: fadeAnimation,
            transform: [{translateY: translateYAnimation}],
          },
        ]}>
        <Icon tintColor={theme.colors.accent} icon="ArrowDown" />
      </Animated.View>
    </ButtonWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: -40,
      right: 24,
      borderWidth: 1,
      padding: spacing.padding.small,
      backgroundColor: colors.background,
      borderColor: Platform.OS !== 'web' ? colors.primary3 : undefined,
      borderRadius: spacing.borderRadius.large,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 6,
    },
  });
};

export default DownButton;
