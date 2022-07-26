import React, { FC } from 'react';
import { StyleProp } from 'react-native';
import { FontAwesomeIcon as RNFontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export interface FontAwesomeIconProps {
  icon?: string | number;
  name?: string;
  size?: number;
  tintColor?: string;
  style?: StyleProp<StyleProp<any>>;
}

const FontAwesomeIcon: FC<FontAwesomeIconProps> = (
  props: FontAwesomeIconProps,
) => {
  const {
    name, size, tintColor, style, ...rest
  } = props;

  return (
    <RNFontAwesomeIcon
      icon={name as any}
      size={size}
      style={[{ color: tintColor }, style]}
      {...rest}
    />
  );
};

export default FontAwesomeIcon;
