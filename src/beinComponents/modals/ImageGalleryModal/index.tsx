import React, {FC} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from '~/beinComponents/Image/FastImage';
import Icon from '~/beinComponents/Icon';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageGalleryModalProps} from '~/beinComponents/modals/ImageGalleryModal/IImageGalleryModalProps';

const ImageGalleryModal: FC<ImageGalleryModalProps> = ({
  visible,
  source,
  onPressClose,
}: ImageGalleryModalProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme, insets);

  const getImageUrls = () => {
    const result: {url: string}[] = [];
    if (source?.length > 0) {
      source?.map?.((item: any) => {
        result.push({url: item?.uri || item});
      });
    } else {
      result.push({url: source?.uri || source});
    }
    return result;
  };

  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        renderImage={image => <FastImage {...image} />}
        imageUrls={getImageUrls()}
        renderHeader={() => (
          <TouchableOpacity style={styles.icon} onPress={onPressClose}>
            <Icon icon="iconClose" tintColor="#fff" onPress={onPressClose} />
          </TouchableOpacity>
        )}
      />
    </Modal>
  );
};

const createStyle = (theme: ITheme, insets: EdgeInsets) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    icon: {
      position: 'absolute',
      zIndex: 2,
      top: insets?.top,
      right: spacing.margin.large,
      padding: spacing.padding.base,
    },
  });
};

export default ImageGalleryModal;
