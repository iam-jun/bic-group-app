import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {red as TINT_COLOR, white as WHITE_COLOR} from '~/theme/colors';
import Text from './Text';
import ScreenWrapper from '../../beinComponents/ScreenWrapper';

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
    <ScreenWrapper
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
    </ScreenWrapper>
  );
};

export default TextBadge;
