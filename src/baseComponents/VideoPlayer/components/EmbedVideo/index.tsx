import React, { FC } from 'react';
import WebView from 'react-native-webview';
import { scaleCoverHeight } from '~/theme/dimension';

interface Props {
  src: string
}
const PLAYER_HEIGHT = scaleCoverHeight();

const EmbedVideo: FC<Props> = ({ src }) => {
  const userAgent = 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/LMY48X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/608.2.11';
  const modifyMeta = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta);';
  const script = `${userAgent}\n${modifyMeta}`;

  return (
    <WebView
      source={{ uri: src }}
      cacheEnabled
      scalesPageToFit
      javaScriptEnabled
      injectedJavaScript={script}
      style={{ width: '100%', height: PLAYER_HEIGHT }}
    />
  );
};

export default EmbedVideo;
