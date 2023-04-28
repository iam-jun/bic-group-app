import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  Modal, StyleSheet, View,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, VideoPlayer } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import useVideoPlayerStore from '~/store/videoPlayer';
import { dimension } from '~/theme';
import { margin } from '~/theme/spacing';

const VideoPlayerWebView = () => {
  const { isVisible, video, actions } = useVideoPlayerStore();
  const theme: ExtendedTheme = useTheme();
  const { deviceHeight } = dimension;
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);
  const [marginTop, setMarginTop] = useState(200);

  const onClose = () => {
    actions.hide();
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const layoutHeight = event?.nativeEvent?.layout?.height;
    if (!layoutHeight) return;

    const marginTop = (deviceHeight - layoutHeight) / 2;
    setMarginTop(marginTop);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      style={styles.modal}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Button
          style={styles.iconClose}
          hitSlop={{
            top: 10, left: 10, right: 10, bottom: 10,
          }}
          onPress={onClose}
        >
          <Icon
            icon="iconClose"
            tintColor={theme.colors.white}
          />
        </Button>
        <View style={[styles.video, { marginTop }]} onLayout={onLayout}>
          <VideoPlayer
            shouldPlay
            src={video?.src}
            posterInfo={{ url: video?.thumbnail, videoHeight: 0, videoWidth: 0 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (insets: EdgeInsets) => StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  iconClose: {
    position: 'absolute',
    right: margin.large,
    top: insets.top + margin.large,
    zIndex: 3,
  },
  video: {
    width: '100%',
    height: 260,
  },
});

export default VideoPlayerWebView;
