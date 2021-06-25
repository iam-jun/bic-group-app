import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import useAuth from '~/hooks/auth';
import {Avatar as RNPAvatar} from 'react-native-paper';

export interface Props {
  uri?: string | undefined | React.ReactNode;
  size?: keyof typeof sizes;
  [x: string]: any;
}

const sizes = {
  small: 24,
  base: 40,
  large: 50,
  big: 60,
};

const Avatar: React.FC<Props> = ({
  style,
  size = 'base',
  user,
  useMyProfile,
  numberOfChars = 2,
  ...props
}) => {
  const [_user, setUser] = useState(user);
  const {user: myProfile} = useAuth();

  React.useEffect(() => {
    if (useMyProfile) setUser(myProfile);
    else setUser(user);
  }, [user, myProfile]);

  if (_user?.avatar) {
    return (
      <RNPAvatar.Image
        {...props}
        style={[styles.container, style]}
        size={sizes[size]}
        source={{uri: _user.avatar}}
      />
    );
  }

  return (
    <RNPAvatar.Text
      style={[styles.container, style]}
      size={sizes[size]}
      label={(_user?.fullName || _user?.name || '').substr(0, 2).toUpperCase()}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

Avatar.defaultProps = {
  size: 'base',
};

export default Avatar;
