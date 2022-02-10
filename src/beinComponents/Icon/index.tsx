import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
  Platform,
} from 'react-native';

import Unicons, {UniconsProps} from './Unicons';
import SvgIcon, {SVGIconProps} from './SvgIcon';

import {useTheme} from 'react-native-paper';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import {spacing} from '~/theme';
import icons, {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
import {View} from 'react-native';
import TextEmojiIcon from '~/beinComponents/Icon/TextEmojiIcon';
import Div from '../Div';
import {useNetInfo} from '@react-native-community/netinfo';

export interface IconProps extends SVGIconProps, UniconsProps {
  icon: IconType | number;
  testID?: string;
  size?: number;
  tintColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: (e: any) => void;
  hitSlop?: {top?: number; bottom?: number; left?: number; right?: number};
}

const Icon: React.FC<IconProps> = ({
  style,
  testID,
  iconStyle,
  labelStyle,
  icon,
  size = 20,
  label,
  tintColor,
  labelColor,
  backgroundColor,
  onPress,
  isButton,
  isLoading,
  disabled,
  hitSlop = {top: 10, left: 10, bottom: 10, right: 10},
}: IconProps) => {
  const NetInfo = useNetInfo();
  const noInternet = NetInfo.isInternetReachable === false;

  const theme: ITheme = useTheme() as ITheme;
  if (isLoading) return <ActivityIndicator size="small" />;

  const {colors} = theme;
  const styles = StyleSheet.create(createStyles(theme));
  tintColor = tintColor || colors.iconTint;

  let _tintColor = disabled
    ? isButton
      ? colors.primary7
      : colors.disabled
    : tintColor;

  const _icon = typeof icon === 'string' ? icons[icon] : icon;
  const _style: StyleProp<ViewStyle> = {};

  let IconComponent, type, name, source;

  if (Unicons[`${_icon || icon}`] || Unicons[`Uil${_icon || icon}`]) {
    IconComponent = Unicons;
    name = _icon || icon;
  } else if (typeof _icon === 'function') {
    IconComponent = SvgIcon;
    source = _icon;
  } else if (
    typeof icon === 'string' &&
    !icons[icon] &&
    !icon.includes('http')
  ) {
    IconComponent = TextEmojiIcon;
    name = icon;
    _style.width = size * 1.3;
    _style.height = size * 1.3;
  } else {
    IconComponent = Image;
    source = _icon;
    _style.width = size;
    _style.height = size;
    _tintColor = undefined;
  }
  const Wrapper = Platform.OS === 'web' ? Text : View;

  return (
    <TouchableOpacity
      disabled={noInternet || disabled || !onPress}
      onPress={onPress}
      hitSlop={hitSlop}>
      <Wrapper style={[styles.container, style, {backgroundColor}]}>
        <Div
          style={[
            isButton && styles.button,
            disabled && isButton && styles.disabled,
            iconStyle,
          ]}>
          <Div className="icon-wrapper" testID={testID}>
            <IconComponent
              style={_style}
              tintColor={_tintColor}
              size={size}
              type={type}
              name={name}
              source={source}
            />
          </Div>
        </Div>
        {label && (
          <Text.ButtonBase
            useI18n
            style={[
              styles.label,
              {color: labelColor || theme.colors.textPrimary},
              labelStyle,
            ]}>
            {label}
          </Text.ButtonBase>
        )}
      </Wrapper>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    button: {
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.primary1,
    },
    disabled: {
      backgroundColor: colors.disabled,
    },
    label: {
      marginStart: spacing.margin.base,
    },
  });
};

export default Icon;
