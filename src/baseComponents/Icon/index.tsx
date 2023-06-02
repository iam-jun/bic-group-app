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

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import SvgIcon, { SVGIconProps } from './SvgIcon';

import Text from '~/baseComponents/Text';
import Image from '~/components/Image';
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
  buttonTestID?: string;
  size?: number;
  tintColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  hitSlop?: {top?: number; bottom?: number; left?: number; right?: number};
  ignoreInternet?: boolean;
  onPress?: (e: any) => void;
}

const Icon: React.FC<IconProps> = ({
  testID,
  buttonTestID,
  style,
  iconStyle,
  labelStyle,
  icon,
  size = 20,
  label,
  tintColor,
  labelColor,
  backgroundColor,
  isButton,
  isLoading,
  ignoreInternet,
  disabled,
  hitSlop = {
    top: 10, left: 10, bottom: 10, right: 10,
  },
  onPress,
}: IconProps) => {
  const noInternet = !useNetworkStore(networkSelectors.getIsInternetReachable);

  const theme: ExtendedTheme = useTheme();
  if (isLoading) return <ActivityIndicator size="small" />;

  const { colors } = theme;
  const styles = StyleSheet.create(createStyles(theme));
  tintColor = tintColor || colors.neutral80;

  let _tintColor: string|undefined = tintColor || colors.neutral80;
  if (disabled) {
    _tintColor = isButton ? colors.purple60 : colors.gray30;
  }

  const _icon = typeof icon === 'string' ? icons[icon] : icon;
  const _style: StyleProp<ViewStyle> = {};

  let IconComponent; let type; let name; let source;

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

  const disableByInternet = !ignoreInternet && noInternet;
  const disabledButton = disableByInternet || disabled || !onPress;

  return (
    <TouchableOpacity
      disabled={disabledButton}
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
