import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import TextContent from '.';

export interface Props {
  size?: number;
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  fontFamily?: string;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const Title: React.FC<Props> = ({
  size = 24,
  weight = 'bold',
  fontFamily,
  color,
  style,
  ...props
}) => {
  return (
    <TextContent
      {...props}
      style={[
        {
          color: color,
          fontSize: size,
          fontWeight: weight,
          fontFamily: fontFamily,
          margin: 16,
        },
        style,
      ]}>
      {props.children}
    </TextContent>
  );
};

export default Title;
