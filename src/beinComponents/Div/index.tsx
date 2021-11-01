import React from 'react';
import {ViewProps} from 'react-native';
import {View} from 'react-native';

export interface Props extends ViewProps {
  className?: string;
  [x: string]: any;
}

const Div: React.FC<Props> = (props: Props) => {
  return <View {...props} />;
};

export default Div;
