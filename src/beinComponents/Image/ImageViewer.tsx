import React, {useState} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';

import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Image, {ImageProps} from '.';
import FastImage from './FastImage';
import Icon from '../Icon';

const ImagePreviewer: React.FC<ImageProps> = ({
  source,
  ...props
}: ImageProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const insets = useSafeAreaInsets();

  const styles = createStyles(theme, insets);

  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image {...props} source={source} />
      </TouchableOpacity>
      <Modal visible={visible} transparent={true}>
        <Icon
          style={styles.icon}
          icon="iconClose"
          tintColor={colors.textReversed}
          onPress={() => setVisible(false)}
        />
        <ImageViewer
          renderImage={image => <FastImage {...image} />}
          imageUrls={[
            {
              url: source?.uri || source,
            },
          ]}
        />
      </Modal>
    </View>
  );
};

const createStyles = (theme: ITheme, insets: EdgeInsets) => {
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
      top: insets.top + (spacing?.margin.large || 16),
      right: spacing.margin.large,
    },
  });
};

export default ImagePreviewer;
