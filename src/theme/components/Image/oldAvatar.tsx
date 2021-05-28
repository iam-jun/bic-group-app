import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../Icon/Icon';
import TextContent from '../Text/TextContent';
import ThemeView from '../ThemeView/ThemeView';
import CircleImage from './CircleImage';

const ACCENT_COLOR = 'accent';
const POPUP_OVERLAY_COLOR = 'overlay';
const WHITE_COLOR = 'white';

const ICON_VERIFIED_USER = 'ICON_VERIFIED_USER';
const accountTypes = {
  GROUP: 'group',
};

const sizes = {
  tiny: 30,
  small: 40,
  default: 50,
  large: 60,
};

const textSizes = {
  tiny: 14,
  small: 24,
  default: 30,
  large: 36,
};

export interface Props {
  containerStyle?: any;
  style?: any;
  user?: any;
  uri?: any;
  color?: any;
  size?: any;
  customSize?: any;
  overlay?: any;
  onPress?: any;
  numberOfChars?: any;
  useMyProfile?: any;
}

const Avatar: React.FC<Props> = ({
  containerStyle,
  style,
  user,
  uri,
  color = ACCENT_COLOR,
  size = 'default',
  customSize,
  overlay,
  onPress,
  numberOfChars = 1,
  useMyProfile = false,
  ...props
}) => {
  const [_user, setUser] = useState(user);

  const _onPress = () => {};

  const borderRadius = user?.type === accountTypes.GROUP ? 8 : 100;

  const textSize = textSizes[size];
  if (customSize) size = customSize;
  else size = sizes[size];

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle, ,]}
      onPress={_onPress}>
      {uri || _user?.avatarUrl ? (
        <CircleImage
          style={style}
          size={size}
          source={{uri: uri || _user.avatarUrl}}
          borderRadius={borderRadius}
          {...props}
        />
      ) : (
        <ThemeView
          color={color}
          style={[
            styles.charContainer,
            {
              width: size,
              height: size,
              borderRadius,
            },
            style,
          ]}>
          <TextContent
            color={WHITE_COLOR}
            weight="bold"
            maxLength={numberOfChars}
            style={[styles.char, {fontSize: textSize}]}>
            {_user?.fullName || _user?.name || ''}
          </TextContent>
        </ThemeView>
      )}
      {overlay && (
        <ThemeView style={styles.overlay} color={POPUP_OVERLAY_COLOR} />
      )}
      {_user?.isVerified && (
        <Icon
          size={12}
          style={styles.iconWrapper}
          iconStyle={styles.icon}
          icon={ICON_VERIFIED_USER}
          backgroundColor={ACCENT_COLOR}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  charContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    zIndex: 999,
    borderColor: '#fff',
    borderWidth: 2,
  },
  icon: {
    width: 13,
    height: 13,
    fontSize: 13,
    lineHeight: 13,
    color: '#fff',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 1000,
  },
  char: {
    textTransform: 'uppercase',
  },
});

export default React.memo(Avatar);
