import React from 'react';
import AvatarComponent, {
  AvatarProps,
} from '~/bicComponents/Avatar/AvatarComponent';

const Tiny: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant="tiny" {...props} />
);
const XSmall: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant="xSmall" {...props} />
);
const Small: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant="small" {...props} />
);
const Base: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant="base" {...props} />
);
const Medium: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant="medium" {...props} />
);
const Large: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant="large" {...props} />
);
const XLarge: React.FC<AvatarProps> = (props: AvatarProps) => (
  <AvatarComponent variant="xLarge" {...props} />
);

const Avatar = Object.assign(
  AvatarComponent, {
    Tiny,
    XSmall,
    Small,
    Base,
    Medium,
    Large,
    XLarge,
  },
);

export default Avatar;
