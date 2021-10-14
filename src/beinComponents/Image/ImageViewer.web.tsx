import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {ImageProps} from '.';
import Div from '../Div';
import Image from './FastImage';
import ImageGalleryModal from '~/beinComponents/modals/ImageGalleryModal';
import {isArray} from 'lodash';

export interface ImagePreviewerProps extends ImageProps {
  initIndex?: number;
}

const ImageViewer = ({source, style, initIndex}: ImageProps) => {
  const [viewerVisible, setViewerVisible] = useState(false);

  const thumbnailSource = isArray(source) ? source?.[initIndex || 0] : source;
  const gallerySource = isArray(source) ? source : [source];

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      setViewerVisible(false);
    }
  };

  return (
    <Div tabIndex="0" onKeyDown={onKeyDown}>
      <TouchableOpacity onPress={() => setViewerVisible(true)}>
        <Image source={thumbnailSource} style={style as any} />
      </TouchableOpacity>
      <ImageGalleryModal
        visible={viewerVisible}
        source={gallerySource}
        initIndex={initIndex}
        onPressClose={() => setViewerVisible(false)}
      />
    </Div>
  );
};

export default ImageViewer;
