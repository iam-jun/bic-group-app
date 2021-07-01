import React from 'react';
import {StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {useTheme, Button} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {colors} from '~/theme';
import Text from '../texts/Text';

const configColors: IObject<any> = colors;

export interface Props {
  title?: string;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyles?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  short?: boolean;
  medium?: boolean;
  long?: boolean;
  max?: boolean;
  theme?: IObject<any>;
  baseBorder?: boolean;
  smallBorder?: boolean;
  largeBorder?: boolean;
  bigBoder?: boolean;
  uppercase?: boolean;
  RightIcon?: any;
  hasRightIcon?: boolean;
  disabledShadow?: boolean;
  secondaryColor?: boolean;
  thirdColor?: boolean;
  disabledDarkMode?: boolean;
  mode?: 'text' | 'outlined' | 'contained';
  type?: 'primary' | 'secondary' | 'light';
  onPress: () => void;
  onLongPress?: () => void;
  [x: string]: any;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

const PrimaryButton: React.FC<Props> = ({
  title,
  short,
  medium,
  long,
  max,
  theme,
  baseBorder,
  smallBorder,
  largeBorder,
  bigBoder,
  contentStyle,
  labelStyles,
  secondaryColor,
  thirdColor,
  mode,
  uppercase,
  hasRightIcon,
  RightIcon,
  icon,
  disabledShadow,
  disabledDarkMode,
  onPress,
  onLongPress,
  style,
  type,
  children,
  disabled,
  ...propsPaper
}) => {
  const themeDefault: IObject<any> = useTheme();
  const {dimension, spacing, colors} = themeDefault;
  const {sizeButton} = dimension;
  const {borderRadius} = spacing;
  const configButton = short
    ? sizeButton.short
    : medium
    ? sizeButton.medium
    : long
    ? sizeButton.long
    : max
    ? sizeButton.max
    : {};
  const configRoundness = baseBorder
    ? borderRadius.base
    : smallBorder
    ? borderRadius.small
    : largeBorder
    ? borderRadius.large
    : bigBoder
    ? borderRadius.big
    : borderRadius.base;
  const modeBtn = mode ? mode : 'contained';
  const uppercaseBtn = uppercase ? uppercase : false;

  const {defaultColor, light, primary, secondary} = colors;

  const colorType =
    type === 'primary'
      ? primary
      : type === 'secondary'
      ? secondary
      : type === 'light'
      ? light
      : defaultColor;

  const contentBtnStyle: any = {
    flexDirection: 'row-reverse',
  };
  const styles = stylesBtn(configButton);
  return (
    <Button
      uppercase={uppercaseBtn}
      mode={modeBtn}
      onPress={onPress}
      onLongPress={onLongPress}
      labelStyle={StyleSheet.flatten([
        {fontSize: dimension.sizes.base},
        labelStyles,
      ])}
      dark={type ? true : false}
      icon={icon}
      contentStyle={StyleSheet.flatten([
        // configButton,
        {height: sizeButton.height},
        secondaryColor &&
          themeDefault.dark && {
            backgroundColor: thirdColor
              ? themeDefault.colors.white
              : themeDefault.colors.background,
          },
        disabledDarkMode && {
          backgroundColor: configColors.light.colors.primary,
        },
        disabledShadow && styles.disableShadowStyle,
        contentStyle,
        hasRightIcon && contentBtnStyle,
      ])}
      theme={{
        roundness: configRoundness,
        ...theme,
      }}
      style={StyleSheet.flatten([
        styles.btnCustom,
        mode === 'outlined' && {borderColor: colorType, borderWidth: 1},
        style && style,
      ])}
      color={colorType}
      disabled={disabled}
      {...propsPaper}>
      <Text reverseDarkMode>{title}</Text>
    </Button>
  );
};

const stylesBtn = (configButton: IObject<any>) =>
  StyleSheet.create({
    disableShadowStyle: {
      elevation: 0,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      borderWidth: 0,
    },
    btnCustom: configButton,
  });

PrimaryButton.defaultProps = {
  title: '',
  contentStyle: {},
  theme: {},
  short: false,
  medium: false,
  long: false,
  max: false,
  baseBorder: false,
  smallBorder: true,
  largeBorder: false,
  bigBoder: false,
  disabledShadow: false,
  secondaryColor: false,
  thirdColor: false,
  disabledDarkMode: false,
  style: {},
  disabled: false,
};

export default PrimaryButton;
