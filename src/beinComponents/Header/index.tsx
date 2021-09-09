import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import Text, {TextProps} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Icon, {IconProps} from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBaseHook} from '~/hooks';
import {ButtonPrimaryProps} from '~/beinComponents/Button/ButtonPrimary';
import {IconType} from '~/resources/icons';
import {ImageProps} from '../Image';
import ViewSpacing from '~/beinComponents/ViewSpacing';

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
  buttonText?: string;
  buttonProps?: ButtonPrimaryProps;
  onPressButton?: () => void;
  menuIcon?: IconType;
  onPressMenu?: (e: any) => void;
  hideBack?: boolean;
  hideBackWeb?: boolean;
  onPressBack?: () => void;
  disableInsetTop?: boolean;
  style?: StyleProp<ViewStyle>;
  removeBorderAndShadow?: boolean;
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
  hideBackWeb,
  onPressBack,
  disableInsetTop,
  style,
  removeBorderAndShadow = false,
}: HeaderProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, dimension} = theme;
  const styles = createStyle(theme);
  const insets = useSafeAreaInsets();

  const {navigation} = useBaseHook();

  const _onPressBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
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
        {!hideBack && !(hideBackWeb && Platform.OS === 'web') && (
          <Icon
            icon="iconBack"
            onPress={_onPressBack}
            size={28}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          />
        )}
        {!!avatar && (
          <Avatar.Group
            source={avatar}
            style={styles.avatar}
            variant="small"
            {...avatarProps}
          />
        )}
        {!!leftIcon && (
          <Icon
            size={14}
            style={{marginLeft: spacing?.margin.base}}
            icon={leftIcon}
            {...leftIconProps}
          />
        )}
        <View style={styles.titleContainer}>
          {!!title && (
            <Text.H5 style={styles.title} {...titleTextProps}>
              {title}
            </Text.H5>
          )}
          {!!subTitle && (
            <Text.Subtitle style={styles.subtitle} {...subTitleTextProps}>
              {subTitle}
            </Text.Subtitle>
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
    avatar: {
      marginHorizontal: spacing.margin.base,
    },
    titleContainer: {
      flex: 1,
      height: '100%',
      marginLeft: spacing.margin.base,
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
