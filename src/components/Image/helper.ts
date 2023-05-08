import _ from 'lodash';
import { StyleProp } from 'react-native';
import type { Source, ImageStyle } from 'react-native-fast-image';
import { BeinImageSizes } from './constants';

export const formatSource = (source: any, width?: number): Source => {
  if (!source) return {};

  if (
    typeof source === 'string'
    && source.toLowerCase?.().startsWith?.('data:')
  ) {
    return { uri: source };
  }

  if (
    (typeof source === 'string'
      && source.toLowerCase?.().startsWith?.('http'))
    || (typeof source === 'object' && source.uri && source.uri.toLowerCase?.().startsWith?.('http'))
  ) {
    const url = typeof source === 'string' ? source : source.uri;
    const char = url.includes('?') ? '&' : '?';
    const imgSize = getImageSizeSupported(width);
    const urlFormatted = imgSize ? `${url}${char}width=${imgSize}` : url;
    return typeof source === 'string' ? { uri: urlFormatted } : { ...source, uri: urlFormatted };
  }

  return source;
};

export const getImageSizeSupported = (width?: number): number | undefined => {
  if (!width) return;
  return BeinImageSizes.find((size) => size > width);
};

export const getWidthStyle = (style: StyleProp<ImageStyle>): number | undefined => {
  const styleArr: any[] = Array.isArray(style) ? [...(_.flattenDeep(style as any))] : [style];
  const styleObj = styleArr.reduce((acc, cur) => ({
    ...acc,
    ...(typeof cur === 'object' ? cur : {}),
  }), {} as any);
  return styleObj.width;
};
