import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Button, {ButtonProps} from '~/beinComponents/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface HeaderProps {
  title?: string;
  subTitle?: string;
  avatar?: any;
  icon?: any;
  onPressIcon?: () => void;
  buttonText?: string;
  buttonProps?: ButtonProps;
  onPressButton?: () => void;
  menuIcon?: any;
  onPressMenu?: () => void;
  hideBack?: boolean;
  disableInsetTop?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subTitle,
  avatar,
  icon,
  onPressIcon,
  buttonText,
  onPressButton,
  buttonProps,
  menuIcon,
  onPressMenu,
  hideBack,
  disableInsetTop,
}: HeaderProps) => {
  const theme: ITheme = useTheme();
  const {spacing, dimension} = theme;
  const styles = createStyle(theme);
  const insets = useSafeAreaInsets();
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
      {!hideBack && <Icon icon={'AngleLeftB'} />}
      {!!avatar && (
        <Avatar avatar={avatar} style={{marginLeft: spacing?.margin.base}} />
      )}
      <View style={{flex: 1, marginLeft: spacing?.margin.base}}>
        {!!title && <Text.H5>{title}</Text.H5>}
        {!!subTitle && <Text.H6>{subTitle}</Text.H6>}
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
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
  });
};

export default Header;
