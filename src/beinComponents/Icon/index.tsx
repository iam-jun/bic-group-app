import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import Unicons, {UniconsProps} from './Unicons';
import SvgIcon, {SVGIconProps} from './SvgIcon';

import {useTheme} from 'react-native-paper';
import Text from '~/beinComponents/Text';
import {spacing} from '~/theme';
import icons, {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
import {View} from 'react-native';

export interface IconProps extends SVGIconProps, UniconsProps {
  icon: IconType;
  size?: number;
  tintColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  hitSlop?: {top?: number; bottom?: number; left?: number; right?: number};
}

const Icon: React.FC<IconProps> = ({
  style,
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
  if (isLoading) return <ActivityIndicator size="small" />;

  const _icon = icons[icon];

  let IconComponent, type, name, source;

  if (Unicons[`${_icon}`] || Unicons[`Uil${_icon}`]) {
    IconComponent = Unicons;
    name = _icon;
  } else {
    IconComponent = SvgIcon;
    source = _icon;
  }

  const theme: ITheme = useTheme();
  const {colors} = theme;

  const styles = StyleSheet.create(createStyles(theme));
  tintColor = tintColor || colors.iconTint;

  const _tintColor = disabled
    ? isButton
      ? colors.primary7
      : colors.disabled
    : tintColor;

  return (
    <TouchableOpacity
      style={[styles.container, style, {backgroundColor}]}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={hitSlop}>
      <View
        style={[
          isButton && styles.button,
          disabled && isButton && styles.disabled,
          iconStyle,
        ]}>
        <IconComponent
          tintColor={_tintColor}
          size={size}
          type={type}
          name={name}
          source={source}
        />
      </View>
      {label && (
        <Text.ButtonSmall
          useI18n
          style={[styles.label, {color: labelColor}, labelStyle]}>
          {label}
        </Text.ButtonSmall>
      )}
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
      marginStart: spacing.margin.small,
    },
  });
};

export default Icon;
