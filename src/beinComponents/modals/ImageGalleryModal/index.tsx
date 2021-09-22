import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
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

  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        renderImage={image => <FastImage {...image} />}
        imageUrls={[
          {
            url: source?.uri || source,
          },
        ]}
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
  const {colors, spacing} = theme;
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
