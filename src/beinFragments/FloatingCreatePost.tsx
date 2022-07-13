import React, {FC, useEffect} from 'react';
import {DeviceEventEmitter, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRootNavigation} from '~/hooks/navigation';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
} from 'react-native-reanimated';

import {ITheme} from '~/theme/interfaces';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import {ISelectAudienceParams} from '~/screens/Post/PostSelectAudience/SelectAudienceHelper';

export interface FloatingCreatePostProps {
  audience?: any;
  createFromGroupId?: number;
}

const FloatingCreatePost: FC<FloatingCreatePostProps> = ({
  audience,
  createFromGroupId,
}: FloatingCreatePostProps) => {
  const showValue = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);
  const {rootNavigation} = useRootNavigation();

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'showFloatingCreatePost',
      isShow => {
        if (isShow) {
          show();
        } else {
          hide();
        }
      },
    );
    return () => {
      listener?.remove?.();
    };
  }, []);

  const onPress = () => {
    const params: ISelectAudienceParams = {
      createFromGroupId,
      isFirstStep: true,
    };
    if (audience) {
      params.initAudience = audience;
    }
    rootNavigation.navigate(homeStack.postSelectAudience, params as any);
  };

  const containerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: spacing.margin.small,
    bottom: interpolate(showValue.value, [0, 0.1, 1], [-50, 8, 8]),
    opacity: interpolate(showValue.value, [0, 1], [0, 1]),
  }));

  const show = (duration = 150) => {
    showValue.value = withTiming(1, {duration});
  };

  const hide = (duration = 150) => {
    showValue.value = withTiming(0, {duration});
  };

  return (
    <Animated.View style={containerStyle}>
      <Button onPress={onPress} style={styles.button}>
        <Icon
          tintColor={colors.iconTintReversed}
          width={20}
          height={20}
          icon={'edit'}
        />
      </Button>
    </Animated.View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    button: {
      width: 44,
      height: 44,
      borderRadius: 4,
      backgroundColor: colors.primary7,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default FloatingCreatePost;
