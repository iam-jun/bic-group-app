import React from 'react';
import { Image as RNImage, View, StyleSheet } from 'react-native';
import UploadingImage from '~/beinComponents/UploadingImage';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { IActivityDataImage } from '~/interfaces/IPost';
import spacing from '~/theme/spacing';

const ASPECT_RATIO = 0.9;

interface PinPostImageProps {
    data: IActivityDataImage[];
    uploadType: ResourceUploadType;
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
        style={styles.image}
        uploadType={uploadType}
        width={isVerticalFirst ? '46%' : '100%'}
        height="100%"
        url={data[0].url || data[0].name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.margin.small,
  },
  image: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  blurImageBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
});

export default PinPostImage;
