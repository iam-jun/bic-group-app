import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Image from './index';
import Text from '../Text/';
import useAuth from '~/hooks/auth';

export interface Props {
  size?: number;
  uri?: string | undefined | React.ReactNode;
  [x: string]: any;
}

const Avatar: React.FC<Props> = ({
  style,
  size,
  user,
  useMyProfile,
  numberOfChars = 1,
  ...props
}) => {
  const [_user, setUser] = useState(user);
  const {user: myProfile} = useAuth();

  React.useEffect(() => {
    if (useMyProfile) setUser(myProfile);
    else setUser(user);
  }, [user, myProfile]);

  if (user.avatar) {
    return (
      <Image
        {...props}
        style={[styles.container, style, {width: size, height: size}]}
        source={{uri: _user.avatar}}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.charContainer,
        {width: size, height: size, backgroundColor: '#2185D0'},
      ]}>
      <Text h2 maxBold style={[styles.char]} maxLength={numberOfChars}>
        {_user?.attributes.name || ''}
      </Text>
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
