import React, {useEffect, useRef, useState, useImperativeHandle} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBackHandler} from '@react-native-community/hooks';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
} from 'react-native-reanimated';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import {IconType} from '~/resources/icons';

import Text, {TextProps} from '~/beinComponents/Text';
import Icon, {IconProps} from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import {ImageProps} from '../Image';
import {ButtonSecondaryProps} from '../Button/ButtonSecondary';
import HeaderSearch from '~/beinComponents/Header/HeaderSearch';

export interface HeaderProps {
  headerRef?: any;
  children?: React.ReactNode;
  title?: string;
  titleTextProps?: TextProps;
  subTitle?: string;
  subTitleTextProps?: TextProps;
  avatar?: any;
  avatarProps?: ImageProps;
  leftIcon?: IconType;
  leftIconProps?: IconProps;
  icon?: IconType;
  rightIcon?: IconType;
  rightIconProps?: IconProps;
  onPressIcon?: () => void;
  buttonVariant?: 'Primary' | 'Secondary' | 'Icon';
  buttonText?: string;
  buttonProps?: ButtonSecondaryProps; // as it contains the ButtonPrimaryProps
  onPressButton?: () => void;
  menuIcon?: IconType;
  onPressMenu?: (e: any) => void;
  hideBack?: boolean;
  hideBackOnLaptop?: boolean;
  onPressBack?: () => void;
  disableInsetTop?: boolean;
  style?: StyleProp<ViewStyle>;
  removeBorderAndShadow?: boolean;
  autoFocusSearch?: boolean;
  searchInputTestID?: string;
  searchIconTestID?: string;
  onFocusSearch?: () => void;
  onSubmitSearch?: () => void;
  onShowSearch?: (isShow: boolean, inputRef?: any) => void;
  onSearchText?: (searchText: string, inputRef?: any) => void;
  searchPlaceholder?: string;
  onPressHeader?: () => void;
  onRightPress?: () => void;
  onPressChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  headerRef,
  children,
  title,
  titleTextProps,
  subTitle,
  subTitleTextProps,
  avatar,
  avatarProps,
  leftIcon,
  leftIconProps,
  icon,
  rightIcon,
  rightIconProps,
  onPressIcon,
  buttonText,
  onPressButton,
  buttonProps,
  menuIcon,
  onPressMenu,
  hideBack,
  hideBackOnLaptop,
  onPressBack,
  disableInsetTop,
  style,
  removeBorderAndShadow = false,
  autoFocusSearch = false,
  searchInputTestID,
  searchIconTestID,
  onFocusSearch,
  onSubmitSearch,
  onShowSearch,
  onSearchText,
  searchPlaceholder,
  onPressHeader,
  onRightPress,
  onPressChat,
}: HeaderProps) => {
  const [isShowSearch, setIsShowSearch] = useState(false);
  const inputRef = useRef<any>();
  const headerSearchRef = useRef<any>();
  const _headerRef = headerRef || useRef();

  const theme: ITheme = useTheme() as ITheme;
  const {spacing, dimension, colors} = theme;
  const styles = createStyle(theme);
  const insets = useSafeAreaInsets();
  const windowDimension = useWindowDimensions();
  const isLaptop = windowDimension.width >= deviceDimensions.laptop;

  const showValue = useSharedValue(1);

  const {navigation} = useBaseHook();

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('showHeader', isShow => {
      if (isShow) {
        show();
      } else {
        hide();
      }
    });
    return () => {
      listener?.remove?.();
    };
  }, []);

  const _onPressBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  };

  const showSearch = () => {
    setIsShowSearch(true);
    onShowSearch?.(true, inputRef);
  };

  const hideSearch = () => {
    setIsShowSearch(false);
    onShowSearch?.(false);
  };

  const setSearchText = (searchText: string) => {
    headerSearchRef?.current?.setSearchText?.(searchText);
  };

  useImperativeHandle(_headerRef, () => ({
    hideSearch,
    showSearch,
    setSearchText,
  }));

  useBackHandler(() => {
    if (isShowSearch) {
      hideSearch();
    } else {
      _onPressBack();
    }
    return true;
  });

  const _onPressSearch = () => {
    if (isShowSearch) {
      hideSearch();
    } else {
      showSearch();
    }
  };

  const _onSearchText = (text: string) => {
    onSearchText?.(text, inputRef);
  };

  const insetTop = disableInsetTop ? 0 : insets.top;
  const contentHeight = dimension?.headerHeight || 44;

  const heightStyle = useAnimatedStyle(() => ({
    height: interpolate(
      showValue.value,
      [0, 1],
      [insetTop, contentHeight + insetTop],
    ),
  }));

  const show = (duration = 200) => {
    showValue.value = withTiming(1, {duration});
  };

  const hide = (duration = 200) => {
    showValue.value = withTiming(0, {duration});
  };

  const renderContent = () => {
    return (
      <Animated.View
        style={[
          heightStyle,
          {
            paddingTop: disableInsetTop ? undefined : insets.top,
            overflow: 'hidden',
            alignItems: 'flex-end',
            flexDirection: 'row',
            backgroundColor: colors.background,
          },
          removeBorderAndShadow ? {} : styles.bottomBorderAndShadow,
          style,
        ]}>
        <View
          style={{
            height: contentHeight,
            flex: 1,
            flexDirection: 'row',
            backgroundColor: colors.background,
            overflow: 'hidden',
            alignItems: 'center',
            paddingRight: spacing.padding.small,
            paddingLeft: spacing.padding.small,
          }}>
          {!hideBack && !(hideBackOnLaptop && isLaptop) && (
            <Icon
              testID="header.back"
              icon="iconBack"
              onPress={_onPressBack}
              size={24}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              style={styles.iconBack}
            />
          )}
          {!!avatar && (
            <TouchableOpacity onPress={onPressHeader} disabled={!onPressHeader}>
              <Avatar.Group
                source={avatar}
                style={styles.avatar}
                variant="small"
                {...avatarProps}
              />
            </TouchableOpacity>
          )}
          {!!leftIcon && (
            <Icon
              size={24}
              style={styles.icon}
              icon={leftIcon}
              onPress={onPressHeader}
              {...leftIconProps}
            />
          )}
          <View style={styles.titleContainer}>
            {!!title && (
              <TouchableOpacity
                onPress={onPressHeader}
                disabled={!onPressHeader}>
                <Text.H5
                  style={styles.title}
                  numberOfLines={1}
                  {...titleTextProps}
                  testID="header.text">
                  {title}
                </Text.H5>
              </TouchableOpacity>
            )}
            {!!subTitle && (
              <TouchableOpacity
                onPress={onPressHeader}
                disabled={!onPressHeader}>
                <Text.Subtitle style={styles.subtitle} {...subTitleTextProps}>
                  {subTitle}
                </Text.Subtitle>
              </TouchableOpacity>
            )}
          </View>
          {!!icon && onPressIcon && (
            <Icon
              icon={icon}
              size={24}
              style={styles.icon}
              onPress={onPressIcon}
              backgroundColor={colors.bgSecondary}
            />
          )}
          {onSearchText && (
            <Icon
              testID={searchIconTestID}
              icon={'iconSearch'}
              size={24}
              style={styles.icon}
              onPress={_onPressSearch}
              backgroundColor={colors.bgSecondary}
            />
          )}
          {onPressChat && (
            <Icon
              icon="iconChat"
              size={24}
              style={styles.icon}
              onPress={onPressChat}
              backgroundColor={colors.bgSecondary}
            />
          )}
          {onPressMenu && (
            <Icon
              icon={menuIcon || 'menu'}
              size={24}
              style={styles.icon}
              onPress={onPressMenu}
              backgroundColor={colors.bgSecondary}
            />
          )}
          {buttonText && onPressButton && (
            <Button.Secondary
              testID="header.button"
              style={{
                borderWidth: buttonProps?.disabled ? 0 : 1,
                borderColor: colors.primary6,
                height: 40,
                marginRight: spacing.margin.tiny,
              }}
              textColor={colors.primary6}
              onPress={onPressButton}
              {...buttonProps}>
              {buttonText}
            </Button.Secondary>
          )}
          {!!rightIcon && (
            <Icon
              size={24}
              icon={rightIcon}
              style={styles.icon}
              onPress={onRightPress}
              backgroundColor={colors.bgSecondary}
              {...rightIconProps}
            />
          )}
          <HeaderSearch
            testID={searchInputTestID}
            headerSearchRef={headerSearchRef}
            inputRef={inputRef}
            isShowSearch={isShowSearch}
            onSearchText={_onSearchText}
            onPressBack={hideSearch}
            placeholder={searchPlaceholder}
            autoFocus={autoFocusSearch}
            onFocus={onFocusSearch}
            onSubmitSearch={onSubmitSearch}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: insetTop,
            backgroundColor: colors.background,
          }}
        />
      </Animated.View>
    );
  };

  return <View testID="header">{children ? children : renderContent()}</View>;
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    bottomBorderAndShadow: {
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      borderColor: colors.borderDivider,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
    iconBack: {
      height: 48,
      width: 48,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.padding.base,
    },
    icon: {
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.padding.small,
      borderRadius: 20,
      marginRight: spacing.margin.tiny,
    },
    avatar: {height: 40, width: 40},
    titleContainer: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      paddingTop: 1.5,
      marginLeft: spacing.padding.large,
    },
    title: {
      height: 24,
      lineHeight: 24,
    },
    subtitle: {
      height: 16,
      lineHeight: 16,
    },
  });
};

export default Header;
