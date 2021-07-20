import React from 'react';
import {StyleSheet, StyleProp, View, ViewStyle} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

interface AvatarProps {
  style?: StyleProp<ViewStyle>;
  avatar?: any;
}

const Avatar: React.FC<AvatarProps> = ({style, avatar}: AvatarProps) => {
  const {spacing, dimension, colors}: ITheme = useTheme();
  return (
    <View
      style={StyleSheet.flatten([
        {
          width: dimension?.avatarSizes?.small,
          height: dimension?.avatarSizes?.small,
          borderRadius: spacing?.borderRadius.small,
          backgroundColor: colors.borderCard,
        },
        style,
      ])}
    />
  );
};

export default Avatar;
