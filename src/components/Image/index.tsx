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
  const formattedSource = formatSource(source || placeholderSource, convertedWidthImg);
  const [_source, setSource] = useState(formattedSource);

  useEffect(() => {
    setSource(formatSource(source || placeholderSource, convertedWidthImg));
  }, [source]);

  const _onError = () => {
    setSource(formatSource(placeholderSource, convertedWidthImg));
  };

  return (
    <FastImage
      {...props}
      source={_source}
      onError={_onError}
      style={[style, !!width && { width }]}
    />
  );
};

export default Image;
