import React from 'react';

export interface SVGIconProps {
  source?: SVGElement;
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
    // @ts-ignore
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
  fill: '#000',
};

export default SvgIcon;
