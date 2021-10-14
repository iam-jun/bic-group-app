import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Image, {ImageProps} from '.';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import {isArray} from 'lodash';

export interface ImagePreviewerProps extends ImageProps {
  initIndex?: number;
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  source,
  initIndex,
  ...props
}: ImagePreviewerProps) => {
  const [visible, setVisible] = useState(false);

  const thumbnailSource = isArray(source) ? source?.[initIndex || 0] : source;
  const gallerySource = isArray(source) ? source : [source];

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image {...props} source={thumbnailSource} />
      </TouchableOpacity>
      <ImageGalleryModal
        visible={visible}
        source={gallerySource}
        initIndex={initIndex}
        onPressClose={() => setVisible(false)}
      />
    </View>
  );
};

export default ImagePreviewer;
