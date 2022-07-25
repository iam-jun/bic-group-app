import React, { memo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { isArray } from 'lodash';
import Image, { ImageProps } from '.';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';

export interface ImagePreviewerProps extends ImageProps {
  initIndex?: number;
  onLongPress?: (event: any) => void;
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  source,
  initIndex,
  onLongPress,
  ...props
}: ImagePreviewerProps) => {
  const [visible, setVisible] = useState(false);

  const thumbnailSource = isArray(source) ? source?.[initIndex || 0] : source;
  const gallerySource = isArray(source) ? source : [source];

  const _onLongPress = (e: any) => {
    onLongPress?.(e);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        onLongPress={_onLongPress}
      >
        <Image {...props} source={thumbnailSource} />
      </TouchableOpacity>
      {visible && (
        <ImageGalleryModal
          visible={visible}
          source={gallerySource}
          initIndex={initIndex}
          onPressClose={() => setVisible(false)}
        />
      )}
    </View>
  );
};

const ImagePreviewerMemo = memo(ImagePreviewer);
ImagePreviewerMemo.whyDidYouRender = true;
export default ImagePreviewer;
