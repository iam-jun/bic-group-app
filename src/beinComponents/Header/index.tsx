import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBackHandler} from '@react-native-community/hooks';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {deviceDimensions} from '~/theme/dimension';
import {IconType} from '~/resources/icons';

import Text, {TextProps} from '~/beinComponents/Text';
import Icon, {IconProps} from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import {ImageProps} from '../Image';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {ButtonSecondaryProps} from '../Button/ButtonSecondary';
import HeaderSearch from '~/beinComponents/Header/HeaderSearch';

export interface HeaderProps {
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
  onShowSearch?: (isShow: boolean) => void;
  onSearchText?: (searchText: string) => void;
  searchPlaceholder?: string;
  onPressHeader?: () => void;
}

const Header: React.FC<HeaderProps> = ({
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
  onShowSearch,
  onSearchText,
  searchPlaceholder,
  onPressHeader,
}: HeaderProps) => {
  const [isShowSearch, setIsShowSearch] = useState(false);

  const theme: ITheme = useTheme() as ITheme;
  const {spacing, dimension} = theme;
  const styles = createStyle(theme);
  const insets = useSafeAreaInsets();
  const windowDimension = useWindowDimensions();
  const isLaptop = windowDimension.width >= deviceDimensions.laptop;

  const {navigation} = useBaseHook();

  const _onPressBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  };

  const showSearch = () => {
    setIsShowSearch(true);
    onShowSearch?.(true);
  };

  const hideSearch = () => {
    setIsShowSearch(false);
    onShowSearch?.(false);
  };

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

  const renderContent = () => {
    return (
      <View
        style={StyleSheet.flatten([
          {
            height:
              (dimension?.headerHeight || 44) +
              (disableInsetTop ? 0 : insets.top),
            paddingTop: disableInsetTop ? undefined : insets.top,
          },
          styles.container,
          removeBorderAndShadow ? {} : styles.bottomBorderAndShadow,
          style,
        ])}>
        <ViewSpacing width={spacing.margin.large} />
        {!hideBack && !(hideBackOnLaptop && isLaptop) && (
          <Icon
            icon="iconBack"
            onPress={_onPressBack}
            size={28}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            style={styles.backButton}
          />
        )}
        {!!avatar && (
          <TouchableOpacity onPress={onPressHeader}>
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
            size={14}
            style={styles.leftIcon}
            icon={leftIcon}
            onPress={onPressHeader}
            {...leftIconProps}
          />
        )}
        <View style={styles.titleContainer}>
          {!!title && (
            <TouchableOpacity onPress={onPressHeader}>
              <Text.H5 style={styles.title} {...titleTextProps}>
                {title}
              </Text.H5>
            </TouchableOpacity>
          )}
          {!!subTitle && (
            <TouchableOpacity onPress={onPressHeader}>
              <Text.Subtitle style={styles.subtitle} {...subTitleTextProps}>
                {subTitle}
              </Text.Subtitle>
            </TouchableOpacity>
          )}
        </View>
        {!!icon && onPressIcon && (
          <Icon
            icon={icon}
            size={20}
            style={{marginRight: spacing?.margin.large}}
            onPress={onPressIcon}
          />
        )}
        {onPressMenu && (
          <Icon
            icon={menuIcon || 'menu'}
            size={20}
            style={{marginRight: spacing?.margin.large}}
            onPress={onPressMenu}
          />
        )}
        {buttonText && onPressButton && (
          <Button.Secondary
            style={{marginRight: spacing?.margin.large}}
            onPress={onPressButton}
            {...buttonProps}>
            {buttonText}
          </Button.Secondary>
        )}
        {onSearchText && (
          <Icon
            icon={'iconSearch'}
            size={20}
            style={{marginRight: spacing?.margin.large}}
            onPress={_onPressSearch}
          />
        )}
        <HeaderSearch
          isShowSearch={isShowSearch}
          onSearchText={onSearchText}
          onPressBack={hideSearch}
          placeholder={searchPlaceholder}
        />
      </View>
    );
  };

  return <View>{children ? children : renderContent()}</View>;
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    bottomBorderAndShadow: {
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      borderColor: colors.borderDivider,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
    backButton: {
      marginRight: spacing.margin.tiny,
    },
    avatar: {
      marginLeft: 6,
      marginRight: spacing.margin.large,
    },
    leftIcon: {
      marginRight: spacing.margin.large,
    },
    titleContainer: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      paddingTop: 1.5,
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
