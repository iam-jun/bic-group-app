import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Image, {ImageProps} from '.';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';

const ImagePreviewer: React.FC<ImageProps> = ({
  source,
  ...props
}: ImageProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image {...props} source={source} />
      </TouchableOpacity>
      <ImageGalleryModal
        visible={visible}
        source={source}
        onPressClose={() => setVisible(false)}
      />
    </View>
  );
};

export default ImagePreviewer;
