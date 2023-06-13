import _, { isArray, isEmpty } from 'lodash';
import { StyleProp } from 'react-native';
import type { Source, ImageStyle } from 'react-native-fast-image';
import { IPost, PostType } from '~/interfaces/IPost';
import { COVER_ARTICLE_WIDTH } from '../articles/ArticleItem';
import { WIDTH_CONTAINER_PHOTO_PREVIEW_DEFAULT } from '../posts/PostPhotoPreview';
import { initLayoutImages } from '../posts/PostPhotoPreview/helper';
import { THUMBNAIL_SERIES_SIZE } from '../series/SeriesContent/TitleSection';
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

export const buildPreloadImagesArray = () => {
  const preloadImagesArray = [];

  return (source?: Source) => {
    if (!isEmpty(source)) {
      preloadImagesArray.push(source);
    }

    return preloadImagesArray;
  };
};

export const getImageUrlsForPreloadImagesOnNewsFeed = (postData: IPost[] | IPost) => {
  let preloadImages = [];
  const pushImageSource = buildPreloadImagesArray();
  let posts: IPost[] = [];

  if (isArray(postData)) {
    posts = posts.concat(postData);
  } else {
    posts.push(postData);
  }

  posts.forEach((post) => {
    if (post.type === PostType.ARTICLE || post.type === PostType.SERIES) {
      const { coverMedia } = post;

      if (!coverMedia) return;

      const widthCover = post.type === PostType.ARTICLE ? COVER_ARTICLE_WIDTH : THUMBNAIL_SERIES_SIZE;

      preloadImages = pushImageSource(formatSource(coverMedia.url, widthCover));

      return;
    }

    const { media } = post;
    const { images } = media || {};

    if (!images || images.length === 0) {
      return;
    }

    const { widthLargeImage, widthSmallImage } = initLayoutImages(images, WIDTH_CONTAINER_PHOTO_PREVIEW_DEFAULT);

    // first image
    preloadImages = pushImageSource(formatSource(images[0].url, widthLargeImage));
    // others image
    if (images.length >= 2) {
      preloadImages = pushImageSource(formatSource(images[1].url, widthSmallImage));
    }
    if (images.length >= 3) {
      preloadImages = pushImageSource(formatSource(images[2].url, widthSmallImage));
    }
    if (images.length >= 4) {
      preloadImages = pushImageSource(formatSource(images[3].url, widthSmallImage));
    }
  });

  return preloadImages;
};
