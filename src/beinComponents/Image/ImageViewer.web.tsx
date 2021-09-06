import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import {ImageProps} from '.';
import Div from '../Div.web';
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

  const onKeyDown = (event: KeyboardEvent) => {
    console.log('onKeyDown', event);
    if (event.keyCode === 27) {
      setViewerVisible(false);
    }
  };

  return (
    <Div tabIndex="0" onKeyDown={onKeyDown}>
      <TouchableOpacity onPress={() => setViewerVisible(true)}>
        <Image source={source} style={style} />
      </TouchableOpacity>
      <Modal
        style={styles.modal}
        transparent
        animationType="fade"
        visible={viewerVisible}>
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
      </Modal>
    </Div>
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
