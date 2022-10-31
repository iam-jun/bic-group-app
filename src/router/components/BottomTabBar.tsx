import { BottomTabBarProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React, { FC, useEffect, useRef } from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import Icon from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';
import { bottomTabIcons, bottomTabIconsFocused } from '~/router/config';
import { useBaseHook } from '~/hooks';
import dimension from '~/theme/dimension';
import { fontFamilies } from '~/theme/fonts';
import spacing from '~/theme/spacing';
import useNotificationStore from '~/screens/Notification/store';
import INotificationsState from '~/screens/Notification/store/Interface';

const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const tabBarVisible = useRef(true).current;
  const showValue = useSharedValue(1);

  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useBaseHook();
  const { colors } = theme;
  const styles = createStyle(
    theme, insets,
  );

  const notiUnseen = useNotificationStore((state: INotificationsState) => state.unseenNumber);

  const tabBadge = { notification: notiUnseen };

  const bottomBarHeight = dimension.bottomBarHeight + insets.bottom;

  const heightStyle = useAnimatedStyle(() => ({
    height: interpolate(showValue.value, [0, 1], [0, bottomBarHeight]),
    overflow: 'hidden',
  }));

  const show = (duration = 150) => {
    if (!tabBarVisible) {
      return;
    }
    showValue.value = withTiming(1, { duration });
  };

  const hide = (duration = 150) => {
    showValue.value = withTiming(0, { duration });
  };

  // const getActiveRouteName = (state: any): any => {
  //   const route: any = state?.routes?.[state?.index];
  //   if (route?.state) {
  //     return getActiveRouteName(route?.state);
  //   }
  //   return route?.name;
  // };

  useEffect(() => {
    const onShow = () => hide(0);
    const onHide = () => show(0);
    const willShowListener = Keyboard.addListener('keyboardWillShow', onShow);
    const showListener = Keyboard.addListener('keyboardDidShow', onShow);
    const willHideListener = Keyboard.addListener('keyboardWillHide', onHide);
    const hideListener = Keyboard.addListener('keyboardDidHide', onHide);
    const showBottomBarListener = DeviceEventEmitter.addListener(
      'showBottomBar',
      (isShow) => {
        if (isShow) {
          show();
        } else {
          hide();
        }
      },
    );
    return () => {
      showListener.remove();
      hideListener.remove();
      willShowListener.remove();
      willHideListener.remove();
      showBottomBarListener?.remove();
    };
  }, []);

  const renderItem = (
    route: any, index: any,
  ) => {
    const { key, name } = route || {};

    const { options } = descriptors[route.key];

    const isFocused = state.index === index;
    const unreadCount = tabBadge[name] || undefined;
    const icon = isFocused ? bottomTabIconsFocused : bottomTabIcons;
    const iconName = icon[name];
    const textColor = isFocused ? colors.purple50 : colors.gray50;
    const styles = tabBarIconStyles(
      theme, isFocused, textColor,
    );

    const onPress = () => {
      DeviceEventEmitter.emit('onTabPress', name);
      const event: any = navigation.emit({ type: 'tabPress', target: route.key } as any);

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }

      // avoid quick scroll in newsfeed then click tab noti => hide bottom tab in screen noti
      setTimeout(() => show(0), 1000);
    };

    const onLongPress = () => {
      DeviceEventEmitter.emit('onTabPress', name);
      navigation.emit({ type: 'tabLongPress', target: route.key });
    };

    return (
      <TouchableOpacity
        key={key}
        accessibilityRole="button"
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={`tab_${name}`}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.container}
      >
        <Icon icon={iconName} size={24} tintColor={isFocused ? colors.purple50 : colors.neutral40} />
        <Text.BadgeXS style={styles.label}>{t(`tabs:${name}`)}</Text.BadgeXS>
        {!!unreadCount && (
          <NotificationsBadge.Alert
            style={styles.badge}
            textStyle={styles.textBadge}
            number={unreadCount}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={heightStyle}>
      <View style={styles.container}>{state.routes.map(renderItem)}</View>
    </Animated.View>
  );
};

const tabBarIconStyles = (
  theme: ExtendedTheme,
  focused: boolean,
  color?: string,
) => {
  const { colors } = theme || {};
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: spacing.margin.small,
      backgroundColor: colors.white,
    },
    label: {
      color,
      textAlign: 'center',
      marginTop: 2,
    },
    badge: {
      position: 'absolute',
      top: '6%',
      left: '54%',
    },
    textBadge: { fontFamily: fontFamilies.BeVietnamProLight },
  });
};

const createStyle = (
  theme: ExtendedTheme, insets: EdgeInsets,
) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: dimension.bottomBarHeight + insets.bottom,
      backgroundColor: colors.white,
      borderTopWidth: 0.5,
      borderColor: colors.neutral5,
      shadowOffset: { width: 0, height: 1 },
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
      paddingBottom: insets.bottom,
    },
  });
};

export default BottomTabBar;
