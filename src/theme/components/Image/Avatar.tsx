import React from 'react';
import {StyleSheet, View} from 'react-native';
import Image from './index';

export interface Props {
  size?: number;
  uri?: string | undefined | React.ReactNode;
  [x: string]: any;
}

const Avatar: React.FC<Props> = ({style, size, uri, ...props}) => {
  if (typeof uri === 'string') {
    return (
      <Image
        {...props}
        style={[styles.container, style, {width: size, height: size}]}
        source={{uri: uri}}
      />
    );
  }

  if (typeof uri === 'function') return uri();

  return (
    <View
      style={[
        styles.container,
        {width: size, height: size, backgroundColor: '#2185D0'},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
  },
});

Avatar.defaultProps = {
  size: 40,
};

export default Avatar;
