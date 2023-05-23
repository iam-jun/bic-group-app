import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Image as RNImage,
} from 'react-native';

import Button from '~/beinComponents/Button';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import Text from '~/baseComponents/Text';
import UploadingImage from '~/beinComponents/UploadingImage';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { IActivityDataImage } from '~/interfaces/IPost';
import dimension from '~/theme/dimension';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;
const ASPECT_RATIO = 0.9;
const SQUARE_RATIO = 1;

export interface PostPhotoPreviewProps {
  style?: StyleProp<ViewStyle>;
  data: IActivityDataImage[];
  width?: number;
  disabled?: boolean;
  enableGalleryModal?: boolean;
  uploadType: ResourceUploadType;
  onPress?: (e?: any) => void;
  onLongPress?: (e?: any) => void;
  onPressMarkSeenPost?: () => void;
}

const PostPhotoPreview: FC<PostPhotoPreviewProps> = ({
  style,
  data = [],
  width = DeviceWidth,
  disabled = false,
  enableGalleryModal = false,
  uploadType,
  onPress,
  onLongPress,
  onPressMarkSeenPost,
}: PostPhotoPreviewProps) => {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [initIndex, setInitIndex] = useState(0);

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  if (!data || data?.length === 0) {
    return null;
  }

  const imageRatioFirst = (data?.[0]?.width || 1) / (data?.[0]?.height || 1);
  const imageRatioSecond = (data?.[1]?.width || 1) / (data?.[1]?.height || 1);
  const isVerticalFirst = imageRatioFirst <= ASPECT_RATIO;
  const isVerticalSecond = imageRatioSecond <= ASPECT_RATIO;
  const isSquareFirst = imageRatioFirst === SQUARE_RATIO;
  const isSquareSecond = imageRatioSecond === SQUARE_RATIO;

  const isMessyOrientation = checkIsMessyOrientation({
    isVerticalFirst,
    isVerticalSecond,
    data,
    isSquareFirst,
    isSquareSecond,
  });
  const isOnlyOneImageVerticle = isVerticalFirst && data?.length === 1;
  const isBothSquare = isSquareFirst && isSquareSecond && data?.length === 2;

  const dfSize = Math.min(width, dimension.maxNewsfeedWidth);
  const _width = dfSize;
  const _height = getHeighContainer(
    dfSize,
    data,
    imageRatioFirst,
    isVerticalFirst,
    isMessyOrientation,
    isBothSquare,
  );

  const containerImagesDirection = handleContainerImagesDirection({
    isBothSquare,
    isMessyOrientation,
    isVerticalFirst,
  });

  const containerSmallImagesDirection = isVerticalFirst ? 'column' : 'row';

  const containerStyle: any = {
    flexDirection: containerImagesDirection,
    width: _width,
    height: _height,
  };

  const wrapperStyle: any = {
    width: dfSize,
    alignItems: 'center',
    backgroundColor: data?.length === 1 ? colors.gray40 : colors.white,
  };

  const _onPress = (e: any, indexImg: number) => {
    if (onPress) {
      onPress(e);
    } else {
      setInitIndex(indexImg);
      setGalleryVisible(true);
      onPressMarkSeenPost?.();
    }
  };

  const _onLongPress = (e: any) => {
    onLongPress?.(e);
  };

  const getImageUrls = () => {
    const result: any = [];
    data.forEach((item) => {
      result.push({
        name: item.origin_name || item.name,
        uri: item.url,
      });
    });
    return result;
  };

  const renderMore = () => (
    <View style={styles.moreContainer}>
      <Text.H4 color={colors.white} testID="post_photo_preview.more_photos">
        +
        {' '}
        {data.length - 4}
      </Text.H4>
    </View>
  );

  const renderSmallImage = (
    indexImg: number,
    width: number,
    url?: string,
    separate?: boolean,
    isRenderMore?: boolean,
  ) => {
    if (!url) return null;

    return (
      <>
        {separate && (
        <ViewSpacing width={SPACING_IMAGE} height={SPACING_IMAGE} />
        )}
        <Button
          style={styles.flex1}
          disabled={disabled}
          activeOpacity={0.8}
          onPress={(e) => _onPress(e, indexImg)}
          onLongPress={_onLongPress}
        >
          <UploadingImage
            style={styles.image}
            uploadType={uploadType}
            width={width}
            height="100%"
            url={url}
          />
          {isRenderMore && renderMore()}
        </Button>
      </>
    );
  };

  const renderBlurImageBackground = () => {
    if (!isOnlyOneImageVerticle) return null;

    return (
      <RNImage
        source={{ uri: data[0]?.url }}
        style={styles.blurImageBg}
        blurRadius={22}
      />
    );
  };

  return (
    <View testID="post_photo_preview" style={[wrapperStyle, style]}>
      <View style={[styles.container, containerStyle]}>
        <View style={{ flex: data?.length === 2 ? 1 : 2 }}>
          <Button
            disabled={disabled}
            activeOpacity={0.8}
            onPress={(e) => _onPress(e, 0)}
            onLongPress={_onLongPress}
          >
            {renderBlurImageBackground()}
            <UploadingImage
              style={styles.image}
              uploadType={uploadType}
              width={
                isOnlyOneImageVerticle
                  ? 0.78 * _width
                  : getWidthLargeImage(_width, data?.length, containerImagesDirection)
              }
              height="100%"
              url={data[0].url || data[0].name}
            />
          </Button>
        </View>
        {data?.length > 1 && (
          <>
            <ViewSpacing width={SPACING_IMAGE} height={SPACING_IMAGE} />
            <View
              style={{
                flex: 1,
                flexDirection: containerSmallImagesDirection,
              }}
            >
              {renderSmallImage(
                1,
                getWidthSmallImage(_width, data?.length, containerSmallImagesDirection, containerImagesDirection),
                data?.[1]?.url || data?.[1]?.name,
              )}
              {renderSmallImage(
                2,
                getWidthSmallImage(_width, data?.length, containerSmallImagesDirection, containerImagesDirection),
                data?.[2]?.url || data?.[2]?.name,
                true,
              )}
              {renderSmallImage(
                3,
                getWidthSmallImage(_width, data?.length, containerSmallImagesDirection, containerImagesDirection),
                data?.[3]?.url || data?.[3]?.name,
                true,
                data?.length > 4,
              )}
            </View>
          </>
        )}
      </View>
      {enableGalleryModal && (
        <View>
          <ImageGalleryModal
            initIndex={initIndex}
            visible={galleryVisible}
            source={getImageUrls()}
            onPressClose={() => setGalleryVisible(false)}
            isShowImgName={false}
          />
        </View>
      )}
    </View>
  );
};

const SPACING_IMAGE = 4;

const createStyle = () => StyleSheet.create({
  container: {},
  image: { borderRadius: 0 },
  flex1: { flex: 1 },
  moreContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(130,128,133,0.64)',
  },
  blurImageBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
});

export default PostPhotoPreview;

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
    return DeviceHeight * 0.7;
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
  return (widthContainer - SPACING_IMAGE * (numberOfHorizontalImages - 1)) / numberOfHorizontalImages;
};

const getWidthLargeImage = (
  widthContainer: number,
  numberOfImages: number,
  flexDirection: 'row' | 'column',
) => {
  if (flexDirection === 'column' || (flexDirection === 'row' && numberOfImages === 1)) {
    return widthContainer;
  }
  if (numberOfImages === 2) {
    return (widthContainer - SPACING_IMAGE) / 2;
  }
  return (widthContainer - SPACING_IMAGE) * (2 / 3);
};

const handleContainerImagesDirection = (params: {
  isVerticalFirst: boolean;
  isMessyOrientation: boolean;
  isBothSquare: boolean;
}) => {
  const { isVerticalFirst, isMessyOrientation, isBothSquare } = params;
  if (isVerticalFirst || isMessyOrientation || isBothSquare) {
    return 'row';
  }
  return 'column';
};

const checkIsMessyOrientation = (params: {
  isVerticalFirst: boolean;
  isVerticalSecond: boolean;
  isSquareFirst: boolean;
  isSquareSecond: boolean;
  data: IActivityDataImage[];
}) => {
  const {
    isVerticalFirst, isSquareFirst, isSquareSecond, isVerticalSecond, data,
  } = params;
  if (
    (isVerticalFirst !== isVerticalSecond
      || (!isVerticalFirst && isSquareSecond)
      || (isSquareFirst && !isVerticalSecond))
    && data?.length === 2
  ) {
    return true;
  }
  return false;
};
