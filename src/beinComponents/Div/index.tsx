import React from 'react';
import {ViewProps} from 'react-native';
import {View} from 'react-native';

export interface Props extends ViewProps {
  className?: string;
  onHover?: (event: any) => void;
  onBlur?: (event: any) => void;
  [x: string]: any;
}

const Div: React.FC<Props> = (props: Props) => {
  return <View {...props} />;
};

export default Div;
