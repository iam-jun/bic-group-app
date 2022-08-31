import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
  View,
} from 'react-native';

import { useNetInfo } from '@react-native-community/netinfo';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import SvgIcon, { SVGIconProps } from './SvgIcon';

import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import icons, { IconType } from '~/resources/icons';

import TextEmojiIcon from '~/baseComponents/Icon/TextEmojiIcon';
import spacing from '~/theme/spacing';
import {
  fontAwesomeIcons,
  fontAwesomeIconValues,
} from '~/services/fontAwesomeIcon';
import FontAwesomeIcon from '~/baseComponents/Icon/FontAwesomeIcon';

export interface IconProps extends SVGIconProps {
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
  buttonTestID?: string;
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
  hitSlop = {
    top: 10, left: 10, bottom: 10, right: 10,
  },
  buttonTestID,
}: IconProps) => {
  const NetInfo = useNetInfo();
  const noInternet = NetInfo.isInternetReachable === false;

  const theme: ExtendedTheme = useTheme();
  if (isLoading) return <ActivityIndicator size="small" />;

  const { colors } = theme;
  const styles = StyleSheet.create(createStyles(theme));
  tintColor = tintColor || colors.neutral80;

  let _tintColor: string|undefined = disabled
    ? isButton
      ? colors.purple60
      : colors.gray30
    : tintColor;

  const _icon = typeof icon === 'string' ? icons[icon] : icon;
  const _style: StyleProp<ViewStyle> = {};

  let IconComponent; let type; let name; let
    source;

  const hasFontAwesomeIcon = !!fontAwesomeIcons[`${icon || _icon}`];
  const hasFontAwesomeIconValue = !!fontAwesomeIconValues[icons[icon]];

  if (hasFontAwesomeIcon || hasFontAwesomeIconValue) {
    IconComponent = FontAwesomeIcon;
    name = _icon || icon;
  } else if (typeof _icon === 'function') {
    IconComponent = SvgIcon;
    source = _icon;
  } else if (
    typeof icon === 'string'
    && !icons[icon]
    && !icon.includes('http')
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

  return (
    <TouchableOpacity
      disabled={noInternet || disabled || !onPress}
      onPress={onPress}
      hitSlop={hitSlop}
      testID={buttonTestID}
    >
      <View style={[styles.container, style, { backgroundColor }]}>
        <View
          style={[
            isButton && styles.button,
            disabled && isButton && styles.disabled,
            iconStyle,
          ]}
        >
          <View testID={testID}>
            <IconComponent
              style={_style as any}
              tintColor={_tintColor}
              size={size}
              type={type}
              name={name}
              source={source}
            />
          </View>
        </View>
        {label && (
          <Text.ButtonM
            useI18n
            style={[
              styles.label,
              { color: labelColor || theme.colors.neutral80 },
              labelStyle,
            ]}
          >
            {label}
          </Text.ButtonM>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    button: {
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.violet1,
    },
    disabled: {
      backgroundColor: colors.gray30,
    },
    label: {
      marginStart: spacing.margin.base,
    },
  });
};

export default Icon;
