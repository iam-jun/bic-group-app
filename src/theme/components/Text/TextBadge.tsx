import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {red as TINT_COLOR, white as WHITE_COLOR} from '~/theme/configs/colors';
import Text from '.';
import ThemeView from '../ThemeView';

export interface Props {
  style?: StyleProp<ViewStyle>;
  value: number | string;
  tintColor?: string;
  textColor?: string;
  size?: number;
}

const TextBadge: React.FC<Props> = ({
  style,
  value,
  tintColor = TINT_COLOR,
  textColor = WHITE_COLOR,
  size = 24,
  ...props
}) => {
  if (value > 9) value = '9+';
  return (
    <ThemeView
      style={[
        {
          backgroundColor: TINT_COLOR,
          borderRadius: 1000,
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <Text style={{color: WHITE_COLOR}} {...props}>
        {value}
      </Text>
    </ThemeView>
  );
};

export default TextBadge;
