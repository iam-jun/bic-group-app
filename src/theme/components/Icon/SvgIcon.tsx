import React from 'react';

export interface SVGIconProps {
  src?: SVGElement;
  size?: number;
  tintColor?: string;
  [x: string]: any;
}

const SVGIcon: React.FC<SVGIconProps> = ({
  svg,
  style,
  size,
  tintColor,
  ...props
}) => {
  const SVGIcon = svg;

  if (!svg) return null;

  return <SVGIcon {...props} width={size} height={size} fill={tintColor} />;
};

SVGIcon.defaultProps = {
  size: 14,
  fill: '#000',
};

export default SVGIcon;
