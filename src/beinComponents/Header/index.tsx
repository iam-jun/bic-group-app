import React, {
  ReactElement,
  useImperativeHandle, useRef, useState,
} from 'react';
import {
  BackHandler,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { debounce } from 'lodash';
import HeaderSearch from '~/beinComponents/Header/HeaderSearch';
import Icon, { IconProps } from '~/baseComponents/Icon';
import Text, { TextProps } from '~/baseComponents/Text';
import { useRootNavigation } from '~/hooks/navigation';
import { IconType } from '~/resources/icons';
import IconChat from '../IconChat';
import spacing from '~/theme/spacing';
import Button, { ButtonProps } from '~/baseComponents/Button';

export interface HeaderProps {
  useI18n?: boolean;
  headerRef?: any;
  children?: React.ReactNode;
  title?: string;
  titleTextProps?: TextProps;
  subTitle?: string | ReactElement;
  subTitleTextProps?: TextProps;
  leftIcon?: IconType;
  leftIconProps?: Omit<IconProps, 'icon'>;
  icon?: IconType;
  rightIcon?: IconType;
  onPressIcon?: () => void;
  buttonVariant?: 'Primary' | 'Secondary' | 'Icon';
  buttonText?: string;
  buttonProps?: ButtonProps;
  onPressButton?: () => void;
  menuIcon?: IconType;
  onPressMenu?: (e: any) => void;
  hideBack?: boolean;
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
  useAnimationTitle?: boolean;
  showStickyHeight?: number;
  stickyHeaderComponent?: React.ReactNode;
  titleHeight?: number;
  headerHeight?: number;
  renderCustomComponent?: () => ReactElement;
}

const Header: React.FC<HeaderProps> = ({
  useI18n,
  headerRef,
  children,
  title,
  titleTextProps,
  subTitle,
  subTitleTextProps,
  leftIcon,
  leftIconProps,
  icon,
  rightIcon,
  onPressIcon,
  buttonText,
  onPressButton,
  buttonProps,
  menuIcon,
  onPressMenu,
  hideBack,
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
  useAnimationTitle,
  showStickyHeight = 0,
  stickyHeaderComponent,
  titleHeight = 25,
  headerHeight = 210,
  renderCustomComponent,
}: HeaderProps) => {
  const [isShowSearch, setIsShowSearch] = useState(false);
  const inputRef = useRef<any>();
  const headerSearchRef = useRef<any>();
  const _headerRef = headerRef || useRef();
  const height = headerHeight + titleHeight;

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme, disableInsetTop);
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);
  const stickyShow = useSharedValue(0);

  const { rootNavigation } = useRootNavigation();

  const _onPressBack = () => {
    if (onPressBack) {
      onPressBack();
    } else if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      // avoid back pressed on root screen
      BackHandler.exitApp();
    }
  };

  const goBack = () => {
    if (isShowSearch) {
      hideSearch();
    } else {
      _onPressBack();
    }
    return true;
  };

  const showSearch = () => {
    setIsShowSearch(true);
    onShowSearch?.(
      true, inputRef,
    );
  };

  const hideSearch = () => {
    setIsShowSearch(false);
    onShowSearch?.(false);
  };

  const setSearchText = (searchText: string) => {
    headerSearchRef?.current?.setSearchText?.(searchText);
  };

  useImperativeHandle(
    _headerRef, () => ({
      hideSearch,
      showSearch,
      setSearchText,
      goBack,
      setScrollY,
    }),
  );

  const _onPressSearch = () => {
    if (isShowSearch) {
      hideSearch();
    } else {
      showSearch();
    }
  };

  const _onSearchText = (text: string) => {
    onSearchText?.(
      text, inputRef,
    );
  };

  const _onPressButton = debounce(() => {
    onPressButton?.();
  });

  const insetTop = disableInsetTop ? 0 : insets.top;

  const titleAnimated = useAnimationTitle
    ? useAnimatedStyle(() => ({
      opacity: interpolate(
        scrollY.value, [0, headerHeight, height], [0, 0, 1],
      ),
    }))
    : {};

  const stickyHeaderStyle = showStickyHeight ? useAnimatedStyle(() => ({
    opacity: interpolate(stickyShow.value, [0, 1], [0, 1]),
    transform: [
      {
        translateY: interpolate(
          stickyShow.value,
          [0, 1],
          [-50, 44],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }), [showStickyHeight]) : {};

  const setScrollY = (offsetY: number) => {
    const _height = showStickyHeight;
    if (offsetY > _height && offsetY < scrollY.value) {
      // show sticky header when scrolling up
      stickyShow.value = withTiming(1);
    } else {
      stickyShow.value = withTiming(0);
    }

    scrollY.value = offsetY;
  };

  const renderContent = () => (
    <Animated.View
      style={[
        styles.container,
        !removeBorderAndShadow && styles.bottomBorderAndShadow,
        style,
      ]}
      testID="header.content"
    >
      <View
        style={styles.leftContainer}
      >
        {!hideBack && (
          <Icon
            testID="header.back"
            icon="iconBack"
            onPress={_onPressBack}
            size={20}
            hitSlop={{
              top: 20, bottom: 20, left: 20, right: 20,
            }}
            style={styles.iconBack}
            buttonTestID="header.back.button"
          />
        )}
        {!!leftIcon && (
          <Icon
            size={24}
            style={styles.icon}
            icon={leftIcon}
            onPress={onPressHeader}
            {...leftIconProps}
            testID="header.leftIcon"
          />
        )}
        <Animated.View style={[styles.titleContainer, titleAnimated]}>
          {!!title && (
            <TouchableOpacity
              onPress={onPressHeader}
              disabled={!onPressHeader}
            >
              <Text.H5
                style={styles.title}
                numberOfLines={1}
                useI18n={useI18n}
                {...titleTextProps}
                testID="header.text"
              >
                {title}
              </Text.H5>
            </TouchableOpacity>
          )}
          {!!subTitle && (
            <TouchableOpacity
              onPress={onPressHeader}
              disabled={!onPressHeader}
            >
              <Text.BodyS
                style={styles.subtitle}
                numberOfLines={1}
                useI18n={useI18n}
                {...subTitleTextProps}
                testID="header.subTitle"
              >
                {subTitle}
              </Text.BodyS>
            </TouchableOpacity>
          )}
        </Animated.View>
        {!!icon && onPressIcon && (
          <Icon
            testID="header.icon"
            buttonTestID="header.icon.button"
            icon={icon}
            size={20}
            style={styles.icon}
            onPress={onPressIcon}
          />
        )}
        {onSearchText && (
          <Icon
            icon="search"
            testID={searchIconTestID}
            buttonTestID="header.searchIcon.button"
            size={18}
            style={styles.icon}
            onPress={_onPressSearch}
          />
        )}
        {onPressChat && <IconChat testID="header.icon_chat" onPress={onPressChat} />}
        {onPressMenu && (
        // <Icon
        //   icon={menuIcon || 'menu'}
        //   size={16}
        //   style={styles.iconMenu}
        //   onPress={onPressMenu}
        //   testID="header.menuIcon"
        //   buttonTestID="header.menuIcon.button"
        // />
          <Button.Raise
            size="small"
            testID="header.menuIcon.button"
            icon={menuIcon || 'menu'}
            onPress={onPressMenu}
          />
        )}
        {!!renderCustomComponent && renderCustomComponent()}
        {(!!buttonText || !!buttonProps) && onPressButton && (
          <Button.Primary
            testID="header.button"
            style={styles.button}
            useI18n={useI18n}
            onPress={_onPressButton}
            {...buttonProps}
          >
            {buttonText}
          </Button.Primary>
        )}
        {!!rightIcon && (
          <Button.Raise
            size="small"
            testID="header.rightIcon.button"
            icon={rightIcon}
            onPress={onRightPress}
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
          backgroundColor: colors.white,
        }}
      />
    </Animated.View>
  );

  return (
    <>
      <View style={styles.header} testID="header">{children || renderContent()}</View>
      {!!stickyHeaderComponent && (
        <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>{stickyHeaderComponent}</Animated.View>
      )}
    </>
  );
};

const createStyle = (theme: ExtendedTheme, disableInsetTop: boolean) => {
  const { colors, elevations } = theme;
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      minHeight: 44,
      paddingTop: disableInsetTop ? undefined : insets.top,
      // overflow: 'hidden',
      alignItems: 'flex-end',
      flexDirection: 'row',
      backgroundColor: colors.white,
      paddingVertical: spacing.padding.tiny,
    },
    leftContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.white,
      overflow: 'hidden',
      alignItems: 'center',
      paddingRight: spacing.padding.small,
      paddingLeft: spacing.padding.small,
    },
    header: { zIndex: 2 },
    bottomBorderAndShadow: {
      ...elevations.e2,
    },
    button: {
      marginRight: spacing.margin.tiny,
    },
    iconBack: {
      height: 44,
      width: 44,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.padding.base,
    },
    icon: {
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.margin.tiny,
    },
    iconMenu: {
      height: 28,
      width: 28,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing.borderRadius.base,
      marginRight: spacing.margin.large,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: spacing.padding.small,
    },
    title: {
      marginRight: spacing.margin.small,
    },
    subtitle: {
      marginRight: spacing.margin.small,
    },
    stickyHeader: {
      zIndex: 1,
      position: 'absolute',
      top: insets.top,
      width: '100%',
    },
  });
};

export default Header;
