import React, {FC, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  DeviceEventEmitter,
  Keyboard,
  Animated,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useBaseHook} from '~/hooks';
import Icon from '~/beinComponents/Icon';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';
import {deviceDimensions, sizes} from '~/theme/dimension';
import useTabBadge from '~/hooks/tabBadge';
import RedDot from '~/beinComponents/Badge/RedDot';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
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

  const show = () => {
    Animated.timing(visibleAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  const hide = () => {
    Animated.timing(visibleAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const willShowSubscription = Keyboard.addListener('keyboardWillShow', hide);
    const showSubscription = Keyboard.addListener('keyboardDidShow', hide);
    const willHideSubscription = Keyboard.addListener('keyboardWillHide', show);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', show);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      willShowSubscription.remove();
      willHideSubscription.remove();
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
        testID={options.tabBarTestID}
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
        {!!unreadCount && <RedDot style={styles.badge} number={unreadCount} />}
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
