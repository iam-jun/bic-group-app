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
const SmallAlt: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'smallAlt'} {...props} />
);
const Medium: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'medium'} {...props} />
);
const Large: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'large'} {...props} />
);
const LargeAlt: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'largeAlt'} {...props} />
);
const UltraSuperLarge: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant={'ultraSuperLarge'} {...props} />
);

const Avatar = Object.assign(AvatarComponent, {
  Tiny,
  Small,
  SmallAlt,
  Medium,
  Large,
  LargeAlt,
  UltraSuperLarge,
  Group,
});

export default Avatar;
