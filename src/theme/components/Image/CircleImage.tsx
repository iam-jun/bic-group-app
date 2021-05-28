import React from 'react';
import {StyleSheet} from 'react-native';
import Image from './Image';

export interface Props {
  style?: any;
  source?: any;
  size?: number | string;
  borderRadius?: number;
}

const CircleImage: React.FC<Props> = ({
  style,
  source,
  size = 50,
  borderRadius = 100,
  ...props
}) => (
  <Image
    {...props}
    source={source}
    style={[styles.container, {width: size, height: size, borderRadius}, style]}
  />
);

const styles = StyleSheet.create({
  container: {},
});

export default CircleImage;
