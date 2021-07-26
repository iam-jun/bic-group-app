import React from 'react';
import AvatarComponent, {
  AvatarProps,
} from '~/beinComponents/Avatar/AvatarComponent';
import Group from './AvatarGroup';

const Tiny: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'tiny'} {...props} />
);
const Small: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'small'} {...props} />
);
const Medium: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'medium'} {...props} />
);
const Large: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'large'} {...props} />
);
const UltraLarge: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'ultraLarge'} {...props} />
);

const Avatar = Object.assign(AvatarComponent, {
  Tiny,
  Small,
  Medium,
  Large,
  UltraLarge,
  Group,
});

export default Avatar;
