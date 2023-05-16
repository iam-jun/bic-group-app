import { dimension } from '~/theme';

const ASPECT_RATIO = 0.9;
const SQUARE_RATIO = 1;
const SPACING_IMAGE = 4;

const getHeighContainer = (
  dfSize,
  data,
  imageRatioFirst,
  isVerticalFirst,
  isMessyOrientation,
  isBothSquare,
) => {
  if (data?.length === 1 && !isVerticalFirst) {
    return dfSize / imageRatioFirst;
  }
  if (data?.length === 1 && isVerticalFirst) {
    return dimension.deviceHeight * 0.7;
  }
  if (isMessyOrientation || isBothSquare) {
    return dfSize / 2;
  }

  return dfSize;
};

const getWidthSmallImage = (
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

const getWidthLargeImage = (
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

  const isMessyOrientation
    = (isVerticalFirst !== isVerticalSecond
      || (!isVerticalFirst && isSquareSecond)
      || (isSquareFirst && !isVerticalSecond))
    && images?.length === 2;
  const isOnlyOneImageVerticle = isVerticalFirst && images?.length === 1;
  const isBothSquare = isSquareFirst && isSquareSecond && images?.length === 2;

  const dfSize = Math.min(widthContainer, dimension.maxNewsfeedWidth);
  const heightContainer = getHeighContainer(
    dfSize,
    images,
    imageRatioFirst,
    isVerticalFirst,
    isMessyOrientation,
    isBothSquare,
  );

  const containerImagesDirection
    = isVerticalFirst || isMessyOrientation || isBothSquare ? 'row' : 'column';
  const containerSmallImagesDirection = isVerticalFirst ? 'column' : 'row';

  const widthLargeImage = isOnlyOneImageVerticle
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
    isOnlyOneImageVerticle,
    containerImagesDirection,
    containerSmallImagesDirection,
    spacingImage: SPACING_IMAGE,
  } as const;
};
