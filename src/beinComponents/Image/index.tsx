import React, {
  useEffect, useState,
} from 'react';

import FastImage, { FastImageProps } from 'react-native-fast-image';
import { formatSource, getWidthStyle } from './helper';

export interface ImageProps extends Omit<FastImageProps, 'source'> {
  source?: any;
  placeholderSource?: any;
  width?: number;
  [x: string]: any;
}

// NOTE: For optimizing, you must provide width prop or width in style prop
//       width must be a number

const Image: React.FC<ImageProps> = ({
  source,
  placeholderSource,
  width,
  ...props
}) => {
  const { style = {} } = props;
  const widthStyle = getWidthStyle(style);
  const widthImg = width || widthStyle;
  const formattedSource = formatSource(source || placeholderSource, widthImg);
  const [_source, setSource] = useState(formattedSource);

  useEffect(() => {
    setSource(formatSource(source || placeholderSource, widthImg));
  }, [source]);

  const _onError = () => {
    setSource(formatSource(placeholderSource, widthImg));
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
