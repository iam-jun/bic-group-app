import React, {FC, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IActivityDataImage} from '~/interfaces/IPost';
import UploadingImage from '~/beinComponents/UploadingImage';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Button from '~/beinComponents/Button';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import {getResourceUrl, IUploadType} from '~/configs/resourceConfig';

const DeviceWidth = Dimensions.get('window').width;

export interface PostPhotoPreviewProps {
  style?: StyleProp<ViewStyle>;
  data: IActivityDataImage[];
  width?: number;
  onPress?: (e?: any) => void;
  onLongPress?: (e?: any) => void;
  disabled?: boolean;
  enableGalleryModal?: boolean;
  uploadType: IUploadType | string;
}

const PostPhotoPreview: FC<PostPhotoPreviewProps> = ({
  style,
  data = [],
  width = DeviceWidth,
  onPress,
  onLongPress,
  disabled = false,
  enableGalleryModal = false,
  uploadType,
}: PostPhotoPreviewProps) => {
  const [galleryVisible, setGalleryVisible] = useState(false);

  const theme = useTheme() as ITheme;
  const {colors, dimension} = theme;
  const styles = createStyle(theme);

  if (data?.length === 0) {
    return null;
  }
  const imageRatio = (data?.[0]?.width || 1) / (data?.[0]?.height || 1);
  const isVertical = imageRatio <= 0.5;
  const dfSize = Math.min(width, dimension.maxNewsfeedWidth);
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
    backgroundColor:
      data?.length === 1 ? colors.borderFocus : colors.background,
  };

  const _onPress = (e: any) => {
    if (onPress) {
      onPress(e);
    } else {
      setGalleryVisible(true);
    }
  };

  const _onLongPress = (e: any) => {
    onLongPress?.(e);
  };

  const getImageUrls = () => {
    const result: any = [];
    data.map(item => {
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
            : getResourceUrl(uploadType, item.name),
        });
      }
    });
    return result;
  };

  const renderMore = () => {
    return (
      <View style={styles.moreContainer}>
        <Text.H4
          color={colors.background}
          testID="post_photo_preview.more_photos">
          + {data.length - 4}
        </Text.H4>
      </View>
    );
  };

  const renderSmallImage = (
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
        <View style={styles.flex1}>
          <UploadingImage
            style={styles.image}
            uploadType={uploadType}
            width={'100%'}
            height={'100%'}
            fileName={fileName}
            url={url}
          />
          {isRenderMore && renderMore()}
        </View>
      </>
    );
  };

  return (
    <Button
      testID="post_photo_preview"
      disabled={disabled}
      activeOpacity={0.8}
      onPress={_onPress}
      onLongPress={_onLongPress}
      style={StyleSheet.flatten([wrapperStyle, style])}>
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        <View style={{flex: data?.length === 2 ? 1 : 2}}>
          <UploadingImage
            style={styles.image}
            uploadType={uploadType}
            width={'100%'}
            height={'100%'}
            fileName={data[0].origin_name}
            url={data[0].url || data[0].name}
          />
        </View>
        {data?.length > 1 && (
          <>
            <ViewSpacing width={4} height={4} />
            <View
              style={{flex: 1, flexDirection: isVertical ? 'column' : 'row'}}>
              {renderSmallImage(
                data?.[1]?.origin_name || data?.[1]?.name,
                data?.[1]?.url || data?.[1]?.name,
              )}
              {renderSmallImage(
                data?.[2]?.origin_name || data?.[2]?.name,
                data?.[2]?.url || data?.[2]?.name,
                true,
              )}
              {renderSmallImage(
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
            visible={galleryVisible}
            source={getImageUrls()}
            onPressClose={() => setGalleryVisible(false)}
          />
        </View>
      )}
    </Button>
  );
};

const createStyle = (theme: ITheme) => {
  return StyleSheet.create({
    container: {},
    image: {borderRadius: 0},
    flex1: {flex: 1},
    moreContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(130,128,133,0.64)',
    },
  });
};

export default PostPhotoPreview;
