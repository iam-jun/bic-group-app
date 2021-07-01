import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Modal, View} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from '../Icon';
import Image from '../Image';
import {IObject} from '~/interfaces/common';
import {colors} from '~/theme';

export interface Props {
  style?: IObject<any>;
  isLoading?: boolean;
  source: any;
  onRemovePress?: () => void;
}

const ImagePreviewer: React.FC<Props> = ({
  onRemovePress,
  isLoading,
  style,
  source,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image {...props} source={source} style={style} isLoading={isLoading} />
        {!isLoading && onRemovePress && (
          <Icon
            tintColor={colors.light.colors.white}
            style={[styles.iconClose, styles.iconRemove]}
            icon="iconClose"
            onPress={() => onRemovePress()}
          />
        )}
      </TouchableOpacity>
      <Modal visible={visible} transparent={true}>
        <Icon
          tintColor={colors.light.colors.white}
          size={30}
          style={styles.iconClose}
          icon="iconClose"
          onPress={() => setVisible(false)}
        />
        <ImageViewer
          renderImage={image => <Image {...image} />}
          imageUrls={[
            {
              url: source?.uri,
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
