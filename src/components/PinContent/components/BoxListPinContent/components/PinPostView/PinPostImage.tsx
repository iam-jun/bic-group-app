import React from 'react';
import { Image as RNImage, View, StyleSheet } from 'react-native';
import UploadingImage from '~/beinComponents/UploadingImage';
import { IUploadType } from '~/configs/resourceConfig';
import { IActivityDataImage } from '~/interfaces/IPost';
import { borderRadius } from '~/theme/spacing';

const ASPECT_RATIO = 0.9;

interface PinPostImageProps {
    data: IActivityDataImage[];
    uploadType: IUploadType | string;
}

const PinPostImage: React.FC<PinPostImageProps> = ({
  data,
  uploadType,
}) => {
  if (!data || data?.length === 0) {
    return null;
  }

  const imageRatioFirst = (data?.[0]?.width || 1) / (data?.[0]?.height || 1);
  const isVerticalFirst = imageRatioFirst <= ASPECT_RATIO;

  const renderBlurImageBackground = () => {
    if (!isVerticalFirst) return null;

    return (
      <RNImage
        testID="pin_post_image.blur_image"
        source={{ uri: data[0]?.url }}
        style={styles.blurImageBg}
        blurRadius={22}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderBlurImageBackground()}
      <UploadingImage
        style={[
          styles.image,
          !isVerticalFirst && styles.borderRadiusBottom,
        ]}
        uploadType={uploadType}
        width={isVerticalFirst ? '46%' : '100%'}
        height="100%"
        fileName={data[0].origin_name}
        url={data[0].url || data[0].name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  borderRadiusBottom: {
    borderBottomLeftRadius: borderRadius.large,
    borderBottomRightRadius: borderRadius.large,
  },
  blurImageBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: borderRadius.large,
    borderBottomRightRadius: borderRadius.large,
  },
});

export default PinPostImage;
