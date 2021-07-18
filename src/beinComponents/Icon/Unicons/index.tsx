import React from 'react';
// @ts-ignore
import * as RnUnicons from '@iconscout/react-native-unicons';

export interface UniconsProps {
  icon?: string;
  name?: string;
  size?: number;
  tintColor?: string;
}

const Unicons: React.FC<UniconsProps> = ({
  name,
  size,
  tintColor,
  ...props
}: UniconsProps) => {
  const Comp = RnUnicons[name] || RnUnicons[`Uil${name}`];

  if (!Comp) {
    return null;
  }

  return <Comp size={size} color={tintColor} {...props} />;
};

export default Object.assign(Unicons, RnUnicons);
