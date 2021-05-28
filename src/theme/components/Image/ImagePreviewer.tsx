import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Modal, View, Text} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from '../Icon/Icon';
import Image from './Image';

export interface Props {
  isLoading?: boolean;
  onRemovePress?: any;
}

const ImagePreviewer: React.FC<Props> = ({
  onRemovePress,
  isLoading,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image {...props} isLoading={isLoading} />
        {!isLoading && onRemovePress && (
          <Icon
            tintColor="white"
            style={[styles.iconClose, styles.iconRemove]}
            icon="ICON_REMOVE"
            onPress={() => onRemovePress()}
          />
        )}
      </TouchableOpacity>
      <Modal visible={visible} transparent={true}>
        <Icon
          tintColor="white"
          size={30}
          style={styles.iconClose}
          icon="ICON_REMOVE"
          onPress={() => setVisible(false)}
        />
        <ImageViewer
          renderImage={image => <Image {...image} />}
          imageUrls={[
            {
              url: props.source?.uri,
            },
          ]}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconClose: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 99,
  },
  iconRemove: {
    top: 15,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

export default ImagePreviewer;
