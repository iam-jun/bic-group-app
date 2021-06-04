import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Image from './index';
import TextContent from '../Text/';

export interface Props {
  size?: number;
  uri?: string | undefined | React.ReactNode;
  [x: string]: any;
}

const Avatar: React.FC<Props> = ({
  style,
  size,
  user,
  uri,
  numberOfChars = 1,
  ...props
}) => {
  const [_user, setUser] = useState(user);

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
        styles.charContainer,
        {width: size, height: size, backgroundColor: '#2185D0'},
      ]}>
      <TextContent h2 maxBold style={[styles.char]} maxLength={numberOfChars}>
        {_user?.fullName || _user?.name || ''}
      </TextContent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    marginStart: 16,
  },
  charContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  char: {
    textTransform: 'uppercase',
    color: 'white',
  },
});

Avatar.defaultProps = {
  size: 40,
};

export default Avatar;
