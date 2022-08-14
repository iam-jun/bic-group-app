import React, { FC, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import { useRootNavigation } from '~/hooks/navigation';

import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import { ISelectAudienceParams } from '~/screens/post/PostSelectAudience/SelectAudienceHelper';
import spacing from '~/theme/spacing';

export interface FloatingCreatePostProps {
  audience?: any;
  createFromGroupId?: string;
}

const FloatingCreatePost: FC<FloatingCreatePostProps> = ({
  audience,
  createFromGroupId,
}: FloatingCreatePostProps) => {
  const showValue = useSharedValue(0);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        'showFloatingCreatePost',
        (isShow) => {
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
    }, [],
  );

  const onPress = () => {
    const params: ISelectAudienceParams = {
      createFromGroupId,
      isFirstStep: true,
    };
    if (audience) {
      params.initAudience = audience;
    }
    rootNavigation.navigate(
      homeStack.postSelectAudience, params as any,
    );
  };

  const containerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: spacing.margin.small,
    bottom: interpolate(
      showValue.value, [0, 0.1, 1], [-50, 8, 8],
    ),
    opacity: interpolate(
      showValue.value, [0, 1], [0, 1],
    ),
  }));

  const show = (duration = 150) => {
    showValue.value = withTiming(
      1, { duration },
    );
  };

  const hide = (duration = 150) => {
    showValue.value = withTiming(
      0, { duration },
    );
  };

  return (
    <Animated.View style={containerStyle}>
      <Button onPress={onPress} style={styles.button}>
        <Icon tintColor={colors.white} width={20} height={20} icon="edit" />
      </Button>
    </Animated.View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    button: {
      width: 44,
      height: 44,
      borderRadius: 4,
      backgroundColor: colors.purple60,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default FloatingCreatePost;
