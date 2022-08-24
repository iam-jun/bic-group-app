import React from 'react';
import { SvgProps } from 'react-native-svg';

export interface SVGIconProps {
  source?: React.FC<SvgProps>;
  size?: number;
  width?: number;
  height?: number;
  tintColor?: string;
  [x: string]: any;
}

const SvgIcon: React.FC<SVGIconProps> = ({
  source,
  size,
  width,
  height,
  tintColor,
  ...props
}: SVGIconProps) => {
  const SVGIcon = source;

  if (!SVGIcon) return null;

  return (
    <SVGIcon
      {...props}
      width={width || size}
      height={height || size}
      fill={tintColor}
    />
  );
};

SvgIcon.defaultProps = {
  size: 14,
  // eslint-disable-next-line react/default-props-match-prop-types
  fill: '#000',
};

export default SvgIcon;
