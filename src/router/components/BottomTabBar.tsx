import {BottomTabBarProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React, {FC, useEffect, useRef} from 'react';
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
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {
  bottomTabIcons,
  bottomTabIconsFocused,
  hideBottomTabRoutes,
} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import useTabBadge from '~/hooks/tabBadge';
import appActions from '~/store/app/actions';
import dimension from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import {useKeySelector} from '~/hooks/selector';

const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  let tabBarVisible = useRef(true).current;
  const dispatch = useDispatch();
  const showValue = useSharedValue(1);
  const avatar = useKeySelector('menu.myProfile.avatar');

  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const {t} = useBaseHook();
  const {colors} = theme;
  const styles = createStyle(theme, insets);

  const tabBadge: any = useTabBadge();
  const bottomBarHeight = dimension.bottomBarHeight + insets.bottom;

  const heightStyle = useAnimatedStyle(() => ({
    height: interpolate(showValue.value, [0, 1], [0, bottomBarHeight]),
    overflow: 'hidden',
  }));

  const show = (duration = 150) => {
    if (!tabBarVisible) {
      return;
    }
    showValue.value = withTiming(1, {duration});
  };

  const hide = (duration = 150) => {
    showValue.value = withTiming(0, {duration});
  };

  const getActiveRouteName = (state: any): any => {
    const route: any = state?.routes?.[state?.index];
    if (route?.state) {
      return getActiveRouteName(route?.state);
    }
    return route?.name;
  };

  useEffect(() => {
    // @ts-ignore
    return navigation.addListener('state', (event: any) => {
      const routeName = getActiveRouteName(event?.data?.state);
      const shouldHideTab = hideBottomTabRoutes.includes(routeName);
      if (shouldHideTab) {
        if (tabBarVisible) {
          tabBarVisible = false;
          hide();
        }
      } else {
        if (!tabBarVisible) {
          tabBarVisible = true;
          show();
        }
      }
    });
  }, [navigation]);

  useEffect(() => {
    const onShow = () => hide(0);
    const onHide = () => show(0);
    const willShowListener = Keyboard.addListener('keyboardWillShow', onShow);
    const showListener = Keyboard.addListener('keyboardDidShow', onShow);
    const willHideListener = Keyboard.addListener('keyboardWillHide', onHide);
    const hideListener = Keyboard.addListener('keyboardDidHide', onHide);
    const showBottomBarListener = DeviceEventEmitter.addListener(
      'showBottomBar',
      isShow => {
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

  const renderItem = (route: any, index: any) => {
    const {key, name} = route || {};

    const {options} = descriptors[route.key];

    const isFocused = state.index === index;
    const unreadCount = tabBadge[name] || undefined;
    const icon = isFocused ? bottomTabIconsFocused : bottomTabIcons;
    // @ts-ignore
    const iconName = icon[name];
    const textColor = isFocused ? colors.purple50 : colors.gray50;
    const styles = tabBarIconStyles(theme, isFocused, textColor);

    const onPress = () => {
      if (name === 'menus') {
        dispatch(appActions.setDrawerVisible(true));
      } else {
        DeviceEventEmitter.emit('onTabPress', name);
        const event: any = navigation.emit({
          type: 'tabPress',
          target: route.key,
        } as any);

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      }
    };

    const onLongPress = () => {
      DeviceEventEmitter.emit('onTabPress', name);
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <TouchableOpacity
        key={key}
        accessibilityRole="button"
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={`tab_${name}`}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.container}>
        {!!name && t(`tabs:${name}`) !== t(`tabs:menus`) ? (
          <Icon icon={iconName} size={20} tintColor="none" />
        ) : (
          <Image
            style={styles.avatarStyle}
            source={avatar || images.img_user_avatar_default}
          />
        )}
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
  const {colors} = theme || {};
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      borderTopWidth: focused ? 2 : 0,
      borderTopColor: colors.purple50,
    },
    label: {
      color: color,
      textAlign: 'center',
    },
    badge: {
      position: 'absolute',
      top: '6%',
      left: '54%',
    },
    textBadge: {fontFamily: fontFamilies.BeVietnamProLight},
    avatarStyle: {
      width: 20,
      height: 20,
      borderRadius: 20 / 2,
    },
  });
};

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: dimension.bottomBarHeight + insets.bottom,
      backgroundColor: colors.white,
      borderTopWidth: 0.5,
      borderColor: colors.neutral5,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
      paddingBottom: insets.bottom,
    },
  });
};

export default BottomTabBar;
