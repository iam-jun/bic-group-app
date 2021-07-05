import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import SvgIcon, {SVGIconProps} from './svgIcon';
import FontIcon, {FontIconProps} from './fontIcon';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import Text from '~/components/texts/Text';
import {spacing} from '~/theme';
import icons, {IconType} from '~/resources/icons';
import {useBaseHook} from '~/hooks';

export interface IconProps extends SVGIconProps, FontIconProps {
  icon: IconType;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  [x: string]: any;
}

const Icon: React.FC<IconProps> = ({
  style,
  iconStyle,
  labelStyle,
  icon,
  label,
  bold,
  tintColor,
  backgroundColor,
  onPress,
  isButton,
  isLoading,
  disabled,
  ...props
}) => {
  if (isLoading) return <ActivityIndicator size="small" />;

  const _icon = icons[icon];

  if (!icon) return null;

  const source = Object.keys(_icon).find(key => key === 'type')
    ? _icon
    : {svgIcon: _icon};

  const IconWrapper = (
    Object.keys(_icon).find(key => key === 'type') ? FontIcon : SvgIcon
  ) as React.ElementType;

  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  tintColor = tintColor || colors.text;

  const styles = StyleSheet.create(createStyles(theme));
  const {t} = useBaseHook();
  const _tintColor = disabled
    ? isButton
      ? colors.white
      : colors.disabled
    : tintColor;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isButton && styles.button,
        style,
        backgroundColor && {backgroundColor},
        disabled && isButton && styles.disabled,
      ]}
      disabled={!onPress}
      onPress={onPress}>
      <IconWrapper
        style={iconStyle}
        tintColor={_tintColor}
        isButton={isButton}
        svg={_icon}
        {...props}
        {...source}
      />
      {label && (
        <Text style={[styles.label, {color: _tintColor}, labelStyle]}>
          {t(label)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: IObject<any>) => {
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
      backgroundColor: colors.icon,
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
