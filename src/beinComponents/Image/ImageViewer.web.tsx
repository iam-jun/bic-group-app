import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import {ImageProps} from '.';
import Icon from '../Icon';
import Image from './FastImage';

const ImageViewer = ({source, style}: ImageProps) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);

  const onClose = () => {
    setZoomIn(false);
    setViewerVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setViewerVisible(true)}>
        <Image source={source} style={style} />
      </TouchableOpacity>
      <Modal
        style={styles.modal}
        transparent
        animationType="fade"
        visible={viewerVisible}>
        <TouchableWithoutFeedback onPress={() => setViewerVisible(false)}>
          <View style={styles.viewer}>
            <Pressable onPress={() => setZoomIn(!zoomIn)}>
              <Image
                source={source}
                className={zoomIn ? 'image-zoom-out' : 'image-zoom-in'}
              />
            </Pressable>
            <Icon
              style={styles.icon}
              icon="iconClose"
              tintColor={colors.textReversed}
              onPress={onClose}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
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
    },
    icon: {
      position: 'absolute',
      zIndex: 2,
      top: spacing.margin.large,
      right: spacing.margin.large,
    },
  });
};

export default ImageViewer;
