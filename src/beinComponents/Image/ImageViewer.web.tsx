import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {ImageProps} from '.';
import Div from '../Div';
import Image from './FastImage';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';

const ImageViewer = ({source, style}: ImageProps) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      setViewerVisible(false);
    }
  };

  return (
    <Div tabIndex="0" onKeyDown={onKeyDown}>
      <TouchableOpacity onPress={() => setViewerVisible(true)}>
        <Image source={source} style={style} />
      </TouchableOpacity>
      <ImageGalleryModal
        visible={viewerVisible}
        source={source}
        onPressClose={() => setViewerVisible(false)}
      />
    </Div>
  );
};

export default ImageViewer;
