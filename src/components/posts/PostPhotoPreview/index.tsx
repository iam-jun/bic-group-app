import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import {
  Dimensions, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';

import Button from '~/beinComponents/Button';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import Text from '~/baseComponents/Text';
import UploadingImage from '~/beinComponents/UploadingImage';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { getResourceUrl, IUploadType } from '~/configs/resourceConfig';
import { IActivityDataImage } from '~/interfaces/IPost';
import dimension from '~/theme/dimension';

const DeviceWidth = Dimensions.get('window').width;

export interface PostPhotoPreviewProps {
  style?: StyleProp<ViewStyle>;
  data: IActivityDataImage[];
  width?: number;
  disabled?: boolean;
  enableGalleryModal?: boolean;
  uploadType: IUploadType | string;
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

  if (data?.length === 0) {
    return null;
  }
  const imageRatio = (data?.[0]?.width || 1) / (data?.[0]?.height || 1);
  const isVertical = imageRatio <= 0.5;
  const dfSize = Math.min(
    width, dimension.maxNewsfeedWidth,
  );
  const _width = data?.length === 1 ? dfSize : dfSize;
  const _height = data?.length === 1 ? dfSize / imageRatio : dfSize;

  const containerStyle: any = {
    flexDirection: isVertical ? 'row' : 'column',
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
      if (item.url) {
        result.push({
          name: item.origin_name || item.name,
          uri: item.url,
        });
      } else if (item.name) {
        result.push({
          name: item.origin_name || item.name,
          uri: item.name.includes('http')
            ? item.name
            : getResourceUrl(
              uploadType, item.name,
            ),
        });
      }
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
    fileName?: string,
    url?: string,
    separate?: boolean,
    isRenderMore?: boolean,
  ) => {
    if (!fileName) {
      return null;
    }
    return (
      <>
        {separate && <ViewSpacing width={4} height={4} />}
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
            width="100%"
            height="100%"
            fileName={fileName}
            url={url}
          />
          {isRenderMore && renderMore()}
        </Button>
      </>
    );
  };

  return (
    <View
      testID="post_photo_preview"
      style={StyleSheet.flatten([wrapperStyle, style])}
    >
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        <View style={{ flex: data?.length === 2 ? 1 : 2 }}>
          <Button
            disabled={disabled}
            activeOpacity={0.8}
            onPress={(e) => _onPress(e, 0)}
            onLongPress={_onLongPress}
          >
            <UploadingImage
              style={styles.image}
              uploadType={uploadType}
              width="100%"
              height="100%"
              fileName={data[0].origin_name}
              url={data[0].url || data[0].name}
            />
          </Button>
        </View>
        {data?.length > 1 && (
          <>
            <ViewSpacing width={4} height={4} />
            <View
              style={{ flex: 1, flexDirection: isVertical ? 'column' : 'row' }}
            >
              {renderSmallImage(
                1,
                data?.[1]?.origin_name || data?.[1]?.name,
                data?.[1]?.url || data?.[1]?.name,
              )}
              {renderSmallImage(
                2,
                data?.[2]?.origin_name || data?.[2]?.name,
                data?.[2]?.url || data?.[2]?.name,
                true,
              )}
              {renderSmallImage(
                3,
                data?.[3]?.origin_name || data?.[3]?.name,
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
});

export default PostPhotoPreview;
