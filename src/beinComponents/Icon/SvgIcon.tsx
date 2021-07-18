import React from 'react';

export interface SVGIconProps {
  source?: SVGElement;
  size?: number;
  tintColor?: string;
  [x: string]: any;
}

const SvgIcon: React.FC<SVGIconProps> = ({
  source,
  size,
  tintColor,
  ...props
}: SVGIconProps) => {
  const SVGIcon = source;

  if (!SVGIcon) return null;

  // @ts-ignore
  return <SVGIcon {...props} width={size} height={size} fill={tintColor} />;
};

SvgIcon.defaultProps = {
  size: 14,
  fill: '#000',
};

export default SvgIcon;
