import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Platform, Animated, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';

interface Props {
  visible: boolean;
  onDownPress: () => void;
}

const DownButton = ({visible, onDownPress}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const tintColor = theme.colors.accent;

  const [isScrollingDown, setIsScrollingDown] = useState(false);

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
    }).start(() => {
      setIsScrollingDown(false);
    });
  }, [visible]);

  const onPress = () => {
    setIsScrollingDown(true);
    onDownPress();
  };

  const renderButton = () => {
    if (isScrollingDown)
      return <LoadingIndicator size={20} color={tintColor} />;

    return (
      <ButtonWrapper style={styles.button} onPress={onPress}>
        <Icon tintColor={tintColor} icon="ArrowDown" />
      </ButtonWrapper>
    );
  };

  return (
    <Animated.View
      nativeID="down-button"
      style={[
        styles.container,
        Platform.OS !== 'web' && !isScrollingDown && styles.shadow,
        {
          opacity: fadeAnimation,
          transform: [{translateY: translateYAnimation}],
        },
      ]}
      pointerEvents="box-none">
      {renderButton()}
    </Animated.View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  const size = 40;

  const basicShape: ViewStyle = {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.borderRadius.large,
  };

  return StyleSheet.create({
    container: {
      ...basicShape,
      position: 'absolute',
      bottom: -size,
      right: 24,
      borderWidth: 1,
      backgroundColor: colors.background,
      borderColor: Platform.OS !== 'web' ? colors.primary3 : undefined,
    },
    shadow: {
      ...basicShape,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 6,
    },
    button: {
      ...basicShape,
      padding: spacing.padding.small,
    },
  });
};

export default DownButton;
