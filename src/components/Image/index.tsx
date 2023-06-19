import React, {
  useEffect, useState,
} from 'react';

import FastImage, { FastImageProps } from 'react-native-fast-image';
import { PixelRatio } from 'react-native';
import { formatSource, getWidthStyle } from './helper';

export interface ImageProps extends Omit<FastImageProps, 'source'> {
  source?: any;
  placeholderSource?: any;
  width?: number;
  usePixelWidth?: boolean; // use for case: small width image
  [x: string]: any;
}

// NOTE: For optimizing, you must provide width prop or width in style prop
//       width must be a number

const Image: React.FC<ImageProps> = ({
  source,
  placeholderSource,
  width,
  usePixelWidth = false,
  ...props
}) => {
  const { style = {} } = props;
  const widthStyle = getWidthStyle(style);
  const widthImg = width || widthStyle;
  const convertedWidthImg = usePixelWidth ? PixelRatio.getPixelSizeForLayoutSize(widthImg) : widthImg;

  const _source = source || placeholderSource;
  const formattedSource = formatSource(_source, convertedWidthImg);
  const [sourceByFormat, setSourceByFormat] = useState(formattedSource);

  useEffect(() => {
    setSourceByFormat(formattedSource);
  }, [source]);

  const _onError = () => {
    setSourceByFormat(formattedSource);
  };

  return (
    <FastImage
      {...props}
      source={sourceByFormat}
      onError={_onError}
      style={[style, !!width && { width }]}
    />
  );
};

export default Image;
