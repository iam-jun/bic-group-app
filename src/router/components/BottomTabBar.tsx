import React, {FC, useEffect, useRef} from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useBaseHook} from '~/hooks';
import Icon from '~/beinComponents/Icon';
import {
  bottomTabIcons,
  bottomTabIconsFocused,
  hideBottomTabRoutes,
} from '~/configs/navigator';
import {deviceDimensions, sizes} from '~/theme/dimension';
import useTabBadge from '~/hooks/tabBadge';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import NotificationsBadge from '~/beinComponents/Badge/NotificationsBadge';

const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  let tabBarVisible = useRef(true).current;
  const visibleAnim = useRef(new Animated.Value(1)).current;

  const theme = useTheme() as ITheme;
  const insets = useSafeAreaInsets();
  const {t} = useBaseHook();
  const {colors} = theme;
  const dimensions = useWindowDimensions();
  const styles = createStyle(theme, insets);

  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const tabBadge: any = useTabBadge();

  const bottomBarHeight = theme.dimension.bottomBarHeight + insets.bottom;

  const height = visibleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bottomBarHeight],
  });

  const show = (duration = 150) => {
    if (!tabBarVisible) {
      return;
    }
    Animated.timing(visibleAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const hide = (duration = 150) => {
    Animated.timing(visibleAnim, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start();
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
    const {key, name, params} = route || {};
    const {options} = descriptors[route.key];

    const isFocused = state.index === index;
    const unreadCount = tabBadge[name] || undefined;
    const icon = isFocused ? bottomTabIconsFocused : bottomTabIcons;
    // @ts-ignore
    const iconName = icon[name];
    const textColor = isFocused ? colors.primary7 : colors.textSecondary;
    const styles = tabBarIconStyles(theme, isFocused, isPhone, textColor);

    const onPress = () => {
      DeviceEventEmitter.emit('onTabPress', name);
      const event: any = navigation.emit({
        type: 'tabPress',
        target: route.key,
      } as any);

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
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
        // activeOpacity={1}
        key={key}
        accessibilityRole="button"
        accessibilityStates={isFocused ? ['selected'] : []}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={`tab_${name}`}
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isFocused ? colors.primary2 : colors.background,
        }}>
        <Icon icon={iconName} size={20} tintColor="none" />
        {isPhone && (
          <Text variant={isFocused ? 'bodySM' : 'bodyS'} style={styles.label}>
            {t(`tabs:${name}`)}
          </Text>
        )}
        {!!unreadCount && (
          <NotificationsBadge.Alert style={styles.badge} number={unreadCount} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={{height, overflow: 'hidden'}}>
      <View style={styles.container}>{state.routes.map(renderItem)}</View>
    </Animated.View>
  );
};

const tabBarIconStyles = (
  theme: ITheme,
  focused: boolean,
  isPhone: boolean,
  color?: string,
) => {
  return StyleSheet.create({
    label: {
      color: color,
      textAlign: 'center',
      fontSize: sizes.subtitle,
    },
    badge: {
      position: 'absolute',
      top: isPhone ? '6%' : '18%',
      left: '54%',
    },
  });
};

const createStyle = (theme: ITheme, insets: EdgeInsets) => {
  const {colors, dimension} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: dimension.bottomBarHeight + insets.bottom,
      backgroundColor: colors.background,
      borderTopWidth: 0.5,
      borderColor: colors.borderDivider,
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
