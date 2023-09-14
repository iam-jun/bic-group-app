import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import {
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
import { initLayoutImages } from './helper';
import { dimension } from '~/theme';

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

export const WIDTH_CONTAINER_PHOTO_PREVIEW_DEFAULT = dimension.deviceWidth;

const PostPhotoPreview: FC<PostPhotoPreviewProps> = ({
  style,
  data = [],
  width = WIDTH_CONTAINER_PHOTO_PREVIEW_DEFAULT,
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

  const {
    widthLargeImage,
    widthSmallImage,
    layoutWidth,
    layoutHeight,
    isOnlyOneLongImage,
    containerImagesDirection,
    containerSmallImagesDirection,
    spacingImage,
  } = initLayoutImages(data, width) || {};

  const wrapperStyle: any = {
    width: layoutWidth,
    alignItems: 'center',
    backgroundColor: data?.length === 1 ? colors.gray40 : colors.white,
  };

  const containerImagesStyle: any = {
    flexDirection: containerImagesDirection,
    width: layoutWidth,
    height: layoutHeight,
  };

  const containerSmallImagesStyle = {
    flex: 1,
    flexDirection: containerSmallImagesDirection,
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
        id: item.id,
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
        {separate && <ViewSpacing width={spacingImage} height={spacingImage} />}
        <Button
          testID="post_photo_preview.small_image"
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
    if (!isOnlyOneLongImage) return null;

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
      <View style={[styles.container, containerImagesStyle]}>
        <View style={{ flex: data?.length === 2 ? 1 : 2 }}>
          <Button
            testID="post_photo_preview.first_image"
            disabled={disabled}
            activeOpacity={0.8}
            onPress={(e) => _onPress(e, 0)}
            onLongPress={_onLongPress}
          >
            {renderBlurImageBackground()}
            <UploadingImage
              style={styles.image}
              uploadType={uploadType}
              width={widthLargeImage}
              height="100%"
              url={data[0].url || data[0].name}
            />
          </Button>
        </View>
        {data?.length > 1 && (
          <>
            <ViewSpacing width={spacingImage} height={spacingImage} />
            <View
              style={containerSmallImagesStyle}
            >
              {renderSmallImage(
                1,
                widthSmallImage,
                data?.[1]?.url || data?.[1]?.name,
              )}
              {renderSmallImage(
                2,
                widthSmallImage,
                data?.[2]?.url || data?.[2]?.name,
                true,
              )}
              {renderSmallImage(
                3,
                widthSmallImage,
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
