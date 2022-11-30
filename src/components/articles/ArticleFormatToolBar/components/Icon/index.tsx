import React from 'react';
import BaseIcon, { IconProps } from '~/baseComponents/Icon';
import { padding } from '~/theme/spacing';

const ICON_SIZE = 14;

const iconWrapperStyle = {
  padding: padding.xSmall,
  marginHorizontal: 2,
};

export const Icon = (props: IconProps) => (
  <BaseIcon
    {...props}
    size={ICON_SIZE}
  />
);

type IconButtonProps = IconProps & { type?: string}

export const IconButton = ({ onPress, type, ...props }: IconButtonProps) => {
  const _onPress = () => onPress?.(type);

  return (
    <Icon
      {...props}
      key={`format-${type}`}
      style={iconWrapperStyle}
      onPress={_onPress}
    />
  );
};

export const IconBack = (
  props: Omit<IconButtonProps, 'icon'>,
) => (
  <IconButton {...props} icon="AnglesLeft" />
);
