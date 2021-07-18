import React from 'react';
// @ts-ignore
import * as ReactUnicons from '@iconscout/react-unicons';

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
  const Comp = ReactUnicons[name] || ReactUnicons[`Uil${name}`];

  if (!Comp) {
    return null;
  }

  return <Comp size={size} color={tintColor} {...props} />;
};

export default Object.assign(Unicons, ReactUnicons);
