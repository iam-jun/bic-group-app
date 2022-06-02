import React from 'react';
// @ts-ignore
import * as RnUnicons from 'react-native-unicons';

export interface UniconsProps {
  icon?: string | number;
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
  // @ts-ignore
  const Comp = RnUnicons[name];

  if (!Comp) {
    return null;
  }

  return <Comp width={size} height={size} color={tintColor} {...props} />;
};

export default Object.assign(Unicons, RnUnicons);
