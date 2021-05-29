import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from '../Icon';
import Image from '.';

export interface Props {
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  onRemovePress?: () => void;
}

const ImagePreviewer: React.FC<Props> = ({
  onRemovePress,
  isLoading,
  style,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image {...props} style={style} isLoading={isLoading} />
        {!isLoading && onRemovePress && (
          <Icon
            tintColor="white"
            style={[styles.iconClose, styles.iconRemove]}
            icon="iconClose"
            onPress={() => onRemovePress()}
          />
        )}
      </TouchableOpacity>
      <Modal visible={visible} transparent={true}>
        <Icon
          tintColor="white"
          size={30}
          style={styles.iconClose}
          icon="iconClose"
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
