import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {renderText, formatDate} from '~/utils/format';

// const FONT_FAMILY_REGULAR = 'Rubik-Regular';
// const FONT_FAMILY_MEDIUM = 'Rubik-Medium';
// const FONT_FAMILY_LIGHT = 'Rubik-Light';
// const FONT_FAMILY_ITALIC = 'Rubik-Italic';
// const FONT_FAMILY_BOLD = 'Rubik-Bold';
// const FONT_FAMILY_SEMIBOLD = 'Rubik-Semibold';

const FONT_SIZES = {
  'very-small': 10,
  small: 12,
  'little-smaller': 13,
  medium: 14,
  large: 16,
  'very-large': 18,
  'medium-button': 15,
  'small-subtitle': 16,
  'medium-title': 17,
  'large-title': 21.328,
  'larger-title': 24,
  'largest-title': 32,
  code: 28,
};

const FONT_WEIGHTS = {
  light: {
    fontWeight: '200',
    // fontFamily: FONT_FAMILY_LIGHT,
  },
  normal: {},
  bold: {
    fontWeight: 'bold',
    // fontFamily: FONT_FAMILY_BOLD,
  },
  medium: {
    // fontFamily: FONT_FAMILY_MEDIUM,
  },
  'semi-bold': {
    fontWeight: '600',
    // fontFamily: FONT_FAMILY_SEMIBOLD,
  },
};
const FONT_STYLE: object = {
  normal: {},
  italic: {
    fontStyle: 'italic',
    // fontFamily: FONT_FAMILY_ITALIC,
  },
};

export interface Props {
  size?: any;
  weight?: any;
  fontStyle?: any;
  color?: any;
  format?: any;
  useFromNow?: any;
  maxFromDays?: any;
  style?: any;
  maxLength?: any;
  ellipsizeMode?: any;
  children?: any;
  inline?: any;
}

const TextContent: React.FC<Props> = ({
  size = 'medium',
  weight = 'normal',
  fontStyle = 'normal',
  color,
  format = 'll',
  useFromNow = true,
  maxFromDays = 3,
  style,
  maxLength = -1,
  ellipsizeMode = 'tail',
  children,
  inline,
  ...props
}) => {
  let value = renderText(`${children}`);
  if (!value) return null;

  const date = formatDate(value, format, useFromNow ? maxFromDays : -1);

  if (date) {
    value = date;
  } else if (maxLength > -1 && value.length > maxLength) {
    value = `${value.substr(0, maxLength)}`;
  }

  return (
    <Text
      ellipsizeMode={ellipsizeMode}
      style={[
        styles.text,
        size && {fontSize: FONT_SIZES[size]},
        weight && FONT_WEIGHTS[weight],
        fontStyle && FONT_STYLE[fontStyle],
        style,
      ]}
      {...props}>
      {inline ? children : value}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // fontFamily: FONT_FAMILY_REGULAR,
  },
});

export default TextContent;
