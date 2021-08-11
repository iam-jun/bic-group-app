import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text, {TextProps} from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBaseHook} from '~/hooks';
import {ButtonPrimaryProps} from '~/beinComponents/Button/ButtonPrimary';
import {IconType} from '~/resources/icons';
import {Platform} from 'react-native';
import {ImageProps} from '../Image';

export interface HeaderProps {
  title?: string;
  titleTextProps?: TextProps;
  subTitle?: string;
  subTitleTextProps?: TextProps;
  avatar?: any;
  avatarProps?: ImageProps;
  icon?: IconType;
  onPressIcon?: () => void;
  buttonText?: string;
  buttonProps?: ButtonPrimaryProps;
  onPressButton?: () => void;
  menuIcon?: IconType;
  onPressMenu?: () => void;
  hideBack?: boolean;
  onPressBack?: () => void;
  disableInsetTop?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  titleTextProps,
  subTitle,
  subTitleTextProps,
  avatar,
  avatarProps,
  icon,
  onPressIcon,
  buttonText,
  onPressButton,
  buttonProps,
  menuIcon,
  onPressMenu,
  hideBack,
  onPressBack,
  disableInsetTop,
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
      ])}>
      {!hideBack && (
        <Icon
          icon="iconBack"
          onPress={_onPressBack}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        />
      )}
      {!!avatar && (
        <Avatar
          source={avatar}
          style={{marginLeft: spacing?.margin.base}}
          {...avatarProps}
        />
      )}
      <View style={{flex: 1, marginLeft: spacing?.margin.base}}>
        {!!title && <Text.H5 {...titleTextProps}>{title}</Text.H5>}
        {!!subTitle && <Text.H6 {...subTitleTextProps}>{subTitle}</Text.H6>}
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
          icon={menuIcon || 'EllipsisV'}
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

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingLeft: spacing?.padding.large,
      borderBottomWidth: Platform.OS === 'android' ? 0 : 0.5,
      borderColor: colors.borderDivider,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
  });
};

export default Header;
