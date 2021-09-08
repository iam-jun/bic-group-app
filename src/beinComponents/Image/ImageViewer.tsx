import React, {useState} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useTheme} from 'react-native-paper';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ITheme} from '~/theme/interfaces';
import Image, {ImageProps} from '.';
import Icon from '../Icon';
import FastImage from './FastImage';

const ImagePreviewer: React.FC<ImageProps> = ({
  source,
  ...props
}: ImageProps) => {
  const theme = useTheme() as ITheme;
  const insets = useSafeAreaInsets();

  const styles = createStyles(theme, insets);

  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image {...props} source={source} />
      </TouchableOpacity>
      <Modal visible={visible} transparent={true}>
        <ImageViewer
          renderImage={image => <FastImage {...image} />}
          imageUrls={[
            {
              url: source?.uri || source,
            },
          ]}
          renderHeader={() => (
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setVisible(false)}>
              <Icon
                icon="iconClose"
                tintColor="#fff"
                onPress={() => setVisible(false)}
              />
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
};

const createStyles = (theme: ITheme, insets: EdgeInsets) => {
  const {spacing} = theme;

  return StyleSheet.create({
    icon: {
      position: 'absolute',
      zIndex: 2,
      top: insets?.top,
      right: spacing.margin.large,
      padding: spacing.padding.base,
    },
  });
};

export default ImagePreviewer;
