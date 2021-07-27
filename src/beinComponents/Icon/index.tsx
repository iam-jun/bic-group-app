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
import FontIcon, {FontIconProps} from './FontIcon';

import {useTheme} from 'react-native-paper';
import Text from '~/beinComponents/Text';
import {spacing} from '~/theme';
import icons from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';

export interface IconProps extends SVGIconProps, FontIconProps, UniconsProps {
  size?: number;
  tintColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  hitSlop?: {top?: number; bottom?: number; left?: number; right?: number};
}

interface IconRequiredProps extends IconProps {
  icon: any;
}

const Icon: React.FC<IconRequiredProps> = ({
  style,
  iconStyle,
  labelStyle,
  icon,
  size = 20,
  label,
  tintColor,
  backgroundColor,
  onPress,
  isButton,
  isLoading,
  disabled,
  hitSlop = {top: 10, left: 10, bottom: 10, right: 10},
  ...props
}: IconRequiredProps) => {
  if (isLoading) return <ActivityIndicator size="small" />;

  // @ts-ignore
  const _icon = icons[icon];
  let IconComponent, type, name, source;

  if (Unicons[icon] || Unicons[`Uil${icon}`]) {
    IconComponent = Unicons;
    name = icon;
  } else if (_icon?.type) {
    IconComponent = FontIcon;
    type = _icon?.type;
    name = _icon?.name;
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
      ? colors.iconTintReversed
      : colors.disabled
    : tintColor;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isButton && styles.button,
        style,
        disabled && isButton && styles.disabled,
        {backgroundColor},
      ]}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={hitSlop}>
      <IconComponent
        style={iconStyle}
        tintColor={_tintColor}
        size={size}
        isButton={isButton}
        type={type}
        name={name}
        source={source}
        {...props}
      />
      {label && (
        <Text.ButtonBase
          useI18n
          style={[styles.label, {color: _tintColor}, labelStyle]}>
          {label}
        </Text.ButtonBase>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    button: {
      padding: 8,
      borderRadius: 100,
      backgroundColor: colors.iconTint,
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
