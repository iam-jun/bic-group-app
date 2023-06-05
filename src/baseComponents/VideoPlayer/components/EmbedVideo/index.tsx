import React, { FC } from 'react';
import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getAutoplayUrl, parseVideoUrl } from '../../helper';

interface Props {
  src: string,
  shouldPlay?: boolean;
}

export interface EmbedUrlData {
  id?: string,
  provider?: string,
  url?: string,
}

const EmbedVideo: FC<Props> = ({ src, shouldPlay }) => {
  const userAgent = 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/LMY48X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/608.2.11';
  const modifyMeta = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta);';
  const script = `${userAgent}\n${modifyMeta}`;

  const data = parseVideoUrl(src);

  if (data.provider === 'youtube') {
    return (
      <YoutubePlayer
        height={400}
        videoId={data.id}
          // autoplay
        play={shouldPlay}
        forceAndroidAutoplay={shouldPlay}
      />
    );
  }

  const autoPlayUrl = shouldPlay ? getAutoplayUrl(src) : src;
  return (
    <WebView
      source={{ uri: autoPlayUrl }}
      cacheEnabled
      scalesPageToFit
      javaScriptEnabled
      allowsFullscreenVideo
      mediaPlaybackRequiresUserAction={false}
      injectedJavaScript={script}
      onMessage={() => {
        // injectedJavaScript not work without onMessage
      }}
      style={{ width: '100%', height: 400 }}
    />
  );
};

export default EmbedVideo;
