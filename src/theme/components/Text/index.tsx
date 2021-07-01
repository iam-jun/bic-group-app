/* eslint-disable no-shadow */
import React from 'react';
import {StyleSheet, Text, TextStyle, StyleProp} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {colors} from '~/theme/configs';
import {formatDate} from '~/utils/format';

const configColors: IObject<any> = colors;

export interface Props {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  medium?: boolean;
  light?: boolean;
  bold?: boolean;
  maxBold?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  reverseDarkMode?: boolean;
  disabledDarkMode?: boolean;
  h1Style?: StyleProp<TextStyle>;
  h2Style?: StyleProp<TextStyle>;
  h3Style?: StyleProp<TextStyle>;
  h4Style?: StyleProp<TextStyle>;
  h5Style?: StyleProp<TextStyle>;
  h6Style?: StyleProp<TextStyle>;
  error?: boolean;
  errorStyle?: StyleProp<TextStyle>;
  colorSecondary?: boolean;
  colorThird?: boolean;
  primary?: StyleProp<TextStyle>;
  secondary?: StyleProp<TextStyle>;
  third?: StyleProp<TextStyle>;
  onPress?: () => void;
  [x: string]: any;
}

const TextElement: React.FC<Props> = props => {
  const {
    style,
    children,
    medium,
    light,
    bold,
    maxBold,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h1Style,
    h2Style,
    h3Style,
    h4Style,
    h5Style,
    h6Style,
    error,
    errorStyle,
    colorSecondary,
    colorThird,
    primary,
    secondary,
    third,
    onPress,
    disabledDarkMode,
    reverseDarkMode,
    format = 'll',
    useFromNow = true,
    maxFromDays = 3,
    maxLength = -1,
    ...rest
  } = props;

  let value = `${children}`;
  if (!value) return null;
  const date = formatDate(value, format, useFromNow ? maxFromDays : -1);
  if (date) {
    value = date;
  } else if (maxLength > -1 && value.length > maxLength) {
    value = `${value.substr(0, maxLength)}`;
  }

  const theme: IObject<any> = useTheme();
  const {fontFamily, dimension, colors} = theme;
  const {sizes, lineHeights, letterSpacing} = dimension;
  const styles = styleText(
    theme,
    sizes,
    fontFamily,
    colors,
    letterSpacing,
    disabledDarkMode,
  );
  return (
    <Text
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.text,
        reverseDarkMode && styles.reverseDarkMode,
        StyleSheet.flatten([primary, style]),
        colorSecondary && {
          color: colors.textSecondary,
        },
        colorThird && third,
        h1 &&
          StyleSheet.flatten([
            {
              fontSize: sizes.h1,
              lineHeight: lineHeights.h1,
            },
            h1Style,
          ]),
        h2 &&
          StyleSheet.flatten([
            {
              fontSize: sizes.h2,
              lineHeight: lineHeights.h2,
            },
            h2Style,
          ]),
        h3 &&
          StyleSheet.flatten([
            {
              fontSize: sizes.h3,
              lineHeight: lineHeights.h3,
            },
            h3Style,
          ]),
        h4 &&
          StyleSheet.flatten([
            {
              fontSize: sizes.h4,
              lineHeight: lineHeights.h4,
            },
            h4Style,
          ]),
        h5 &&
          StyleSheet.flatten([
            {
              fontSize: sizes.h5,
              lineHeight: lineHeights.h5,
            },
            h5Style,
          ]),
        h6 &&
          StyleSheet.flatten([
            {
              fontSize: sizes.h6,
              lineHeight: lineHeights.h6,
            },
            h6Style,
          ]),
        error &&
          StyleSheet.flatten([
            {
              fontSize: sizes.error,
              lineHeight: lineHeights.error,
              color: colors.error,
            },
            errorStyle,
          ]),
        light && styles.light,
        medium && styles.medium,
        bold && styles.bold,
        maxBold && styles.maxBold,
      ])}
      {...rest}>
      {value}
    </Text>
  );
};

TextElement.defaultProps = {
  medium: false,
  light: false,
  bold: false,
  maxBold: false,
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  colorSecondary: false,
  colorThird: false,
  style: {},
  h1Style: {},
  h2Style: {},
  h3Style: {},
  h4Style: {},
  h5Style: {},
  h6Style: {},
  children: '',
  disabledDarkMode: false,
  reverseDarkMode: false,
};

const styleText = (
  theme: any,
  sizes: any,
  fonts: any,
  colors: any,
  letterSpacing: any,
  disabledDarkMode: any,
) =>
  StyleSheet.create({
    text: {
      fontSize: sizes.base,
      ...fonts.regular,
      textAlign: 'left',
      color: disabledDarkMode ? configColors.light.text : colors.text,
      letterSpacing: letterSpacing.base,
    },
    reverseDarkMode: {
      color: !theme.dark
        ? configColors.dark.colors.text
        : configColors.light.colors.text,
    },
    light: {
      ...fonts.light,
    },
    medium: {
      ...fonts.medium,
    },
    bold: {
      ...fonts.bold,
    },
    maxBold: {
      ...fonts.maxBold,
    },
  });

export default TextElement;
