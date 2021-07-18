import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Free from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Controls = {
  AntDesign: AntDesign,
  Entypo: Entypo,
  EvilIcons: EvilIcons,
  Feather: Feather,
  FontAwesome: FontAwesome,
  FontAwesome5: FontAwesome5Free,
  Foundation: Foundation,
  Ionicons: Ionicons,
  MaterialIcons: MaterialIcons,
  MaterialCommunityIcons: MaterialCommunityIcons,
  Octicons: Octicons,
  Zocial: Zocial,
  SimpleLineIcons: SimpleLineIcons,
};

export interface FontIconProps {
  style?: StyleProp<ViewStyle>;
  type?: keyof typeof Controls;
  name?: string;
  tintColor?: string;
  [x: string]: any;
}

const FontIcon: React.FC<FontIconProps> = ({
  type,
  name,
  tintColor,
  size,
  ...props
}: FontIconProps) => {
  if (!type || !name) return null;

  const Control = Controls[type];

  if (!Control) return null;

  return (
    <Control
      {...props}
      name={name}
      color={tintColor}
      style={[
        styles.icon,
        size && {
          width: size,
          height: size,
          fontSize: size,
          lineHeight: size,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
});

export default FontIcon;
