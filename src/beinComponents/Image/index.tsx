import React, { useEffect, useState } from 'react';

import FastImage from 'react-native-fast-image';

export interface ImageProps {
  source?: any;
  cache?: boolean;
  placeholderSource?: any;
  [x: string]: any;
}

const Image: React.FC<ImageProps> = ({
  source,
  cache = true,
  placeholderSource,
  ...props
}: ImageProps) => {
  const [_source, setSource] = useState(formatSource(source || placeholderSource));

  useEffect(() => {
    updateSource(formatSource(source || placeholderSource));
  }, [source]);

  const _onError = () => {
    placeholderSource && updateSource(placeholderSource);
  };

  const updateSource = (source: any) => {
    if (
      typeof source === 'string'
      && source.toLowerCase?.().startsWith?.('http')
    ) {
      const char = source.includes('?') ? '&' : '?';
      setSource({ uri: cache ? source : source + char + Date.now() });
    } else {
      setSource(source);
    }
  };

  return (
    <FastImage
      {...props}
      source={_source}
      onError={_onError}
    />
  );
};

export default Image;

const formatSource = (source: any, cache?: boolean) => {
  if (
    typeof source === 'string'
      && source.toLowerCase?.().startsWith?.('http')
  ) {
    const char = source.includes('?') ? '&' : '?';
    return { uri: cache ? source : source + char + Date.now() };
  }
  return source;
};
