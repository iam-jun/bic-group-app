import { dimension } from '~/theme';

export const ASPECT_RATIO = 0.9;
export const DOUBLE_RATIO = 0.5;
export const SQUARE_RATIO = 1;
export const SPACING_IMAGE = 4;

export const getHeighContainer = (
  dfSize,
  data,
  imageRatioFirst,
  isVerticalFirst,
  isMessyOrientation,
  isBothSquare,
  isOnlyOneLongImage,
  isLongFirst,
) => {
  if (
    (data?.length === 1 && !isVerticalFirst)
    || (data?.length === 1 && isVerticalFirst && !isLongFirst)
  ) {
    return dfSize / imageRatioFirst;
  }
  if (isOnlyOneLongImage) {
    return dimension.deviceHeight * 0.7;
  }
  if (isMessyOrientation || isBothSquare) {
    return dfSize / 2;
  }

  return dfSize;
};

export const getWidthSmallImage = (
  widthContainer: number,
  numberOfImages: number,
  containerSmallImagesDirection: 'row' | 'column',
  containerImagesDirection: 'row' | 'column',
) => {
  if (containerSmallImagesDirection === 'column') {
    if (numberOfImages === 2) {
      return (widthContainer - SPACING_IMAGE) / 2;
    }
    return (widthContainer - SPACING_IMAGE) / 3;
  }
  if (numberOfImages === 2) {
    if (containerImagesDirection === 'row') {
      return (widthContainer - SPACING_IMAGE) / 2;
    }
    return widthContainer;
  }
  const numberOfHorizontalImages = numberOfImages === 3 ? 2 : 3;
  return (
    (widthContainer - SPACING_IMAGE * (numberOfHorizontalImages - 1))
    / numberOfHorizontalImages
  );
};

export const getWidthLargeImage = (
  widthContainer: number,
  numberOfImages: number,
  flexDirection: 'row' | 'column',
) => {
  if (
    flexDirection === 'column'
    || (flexDirection === 'row' && numberOfImages === 1)
  ) {
    return widthContainer;
  }
  if (numberOfImages === 2) {
    return (widthContainer - SPACING_IMAGE) / 2;
  }
  return (widthContainer - SPACING_IMAGE) * (2 / 3);
};

export const initLayoutImages = (images: any[], widthContainer: number) => {
  if (!images || images.length === 0) return;

  const imageRatioFirst
    = (images?.[0]?.width || 1) / (images?.[0]?.height || 1);
  const imageRatioSecond
    = (images?.[1]?.width || 1) / (images?.[1]?.height || 1);
  const isVerticalFirst = imageRatioFirst <= ASPECT_RATIO;
  const isVerticalSecond = imageRatioSecond <= ASPECT_RATIO;
  const isSquareFirst = imageRatioFirst === SQUARE_RATIO;
  const isSquareSecond = imageRatioSecond === SQUARE_RATIO;
  const isLongFirst = imageRatioFirst <= DOUBLE_RATIO;

  const isMessyOrientation
    = (isVerticalFirst !== isVerticalSecond
      || (!isVerticalFirst && isSquareSecond)
      || (isSquareFirst && !isVerticalSecond))
    && images?.length === 2;
  const isOnlyOneLongImage = isVerticalFirst && images?.length === 1 && isLongFirst;
  const isBothSquare = isSquareFirst && isSquareSecond && images?.length === 2;

  const dfSize = Math.min(widthContainer, dimension.maxNewsfeedWidth);
  const heightContainer = getHeighContainer(
    dfSize,
    images,
    imageRatioFirst,
    isVerticalFirst,
    isMessyOrientation,
    isBothSquare,
    isOnlyOneLongImage,
    isLongFirst,
  );

  const containerImagesDirection
    = isVerticalFirst || isMessyOrientation || isBothSquare ? 'row' : 'column';
  const containerSmallImagesDirection = isVerticalFirst ? 'column' : 'row';

  const widthLargeImage = isOnlyOneLongImage
    ? 0.78 * dfSize
    : getWidthLargeImage(dfSize, images?.length, containerImagesDirection);
  const widthSmallImage = getWidthSmallImage(
    dfSize,
    images?.length,
    containerSmallImagesDirection,
    containerImagesDirection,
  );

  return {
    widthLargeImage,
    widthSmallImage,
    layoutWidth: dfSize,
    layoutHeight: heightContainer,
    isOnlyOneLongImage,
    containerImagesDirection,
    containerSmallImagesDirection,
    spacingImage: SPACING_IMAGE,
  } as const;
};
