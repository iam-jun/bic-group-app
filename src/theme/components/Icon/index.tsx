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
import SvgIcon, {SVGIconProps} from './SvgIcon';
import FontIcon, {FontIconProps} from './FontIcon';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import Text from '~/theme/components/Text';
import {spacing} from '~/theme/configs';
import icons from '~/constants/icons';

export interface IconProps extends SVGIconProps, FontIconProps {
  icon: keyof typeof icons;
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

  const IconWrapper = Object.keys(_icon).find(key => key === 'type')
    ? FontIcon
    : SvgIcon;

  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  tintColor = tintColor || colors.text;

  const styles = StyleSheet.create(createStyles(theme));

  if (isButton && !tintColor) tintColor = colors.white;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isButton && styles.button,
        style,
        backgroundColor && {backgroundColor},
        disabled && styles.disabled,
      ]}
      disabled={!onPress}
      onPress={onPress}>
      <IconWrapper
        style={iconStyle}
        tintColor={tintColor}
        isButton={isButton}
        svg={_icon}
        {...props}
        {...source}
      />
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
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
