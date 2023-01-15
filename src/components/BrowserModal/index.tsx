import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

interface Props {
  url: string;
}

const BrowserModal: FC<Props> = ({ url }) => (
  <WebView
    source={{ uri: url }}
    cacheEnabled
    javaScriptEnabled
    startInLoadingState
    allowsFullscreenVideo
    style={styles.container}
  />
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default BrowserModal;
