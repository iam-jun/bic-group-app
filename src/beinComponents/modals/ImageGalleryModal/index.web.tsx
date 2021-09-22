import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Icon from '~/beinComponents/Icon';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Image from '~/beinComponents/Image/FastImage';
import Div from '~/beinComponents/Div';
import {ImageGalleryModalProps} from '~/beinComponents/modals/ImageGalleryModal/IImageGalleryModalProps';

const ImageGalleryModal: FC<ImageGalleryModalProps> = ({
  visible,
  source,
  zoomIn,
  onPressClose,
  onPressZoom,
}: ImageGalleryModalProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme, insets);

  return (
    <Modal
      style={styles.modal}
      transparent
      animationType="fade"
      visible={visible}>
      <TouchableWithoutFeedback onPress={onPressClose}>
        <View style={styles.viewer}>
          <Pressable onPress={onPressZoom}>
            <Image
              source={source}
              className={zoomIn ? 'image-zoom-out' : 'image-zoom-in'}
            />
          </Pressable>
          <Div tabIndex="1" style={styles.icon}>
            <Icon
              icon="iconClose"
              tintColor={colors.textReversed}
              onPress={onPressClose}
            />
          </Div>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyle = (theme: ITheme, insets: EdgeInsets) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    modal: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewer: {
      backgroundColor: colors.backdrop,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      zIndex: 2,
      top: spacing.margin.large,
      right: spacing.margin.large,
    },
  });
};

export default ImageGalleryModal;
