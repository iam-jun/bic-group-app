import React, {
  FC,
} from 'react';

import { VideoProps } from 'expo-av';

import { getVideoExtention } from './helper';
import EmbedVideo from './components/EmbedVideo';
import FileVideo from './components/FileVideo';

export interface VideoPlayerRef {
  play: () => void,
  pause: () => void,
}

const SUPPORTED_VIDEOS = ['mp4', 'mov', 'webm', 'wmv', 'avi'];

export interface VideoPlayerProps extends VideoProps {
  src: string;
  thumbnail: string,
  videoRef?: React.MutableRefObject<VideoPlayerRef>;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  ...props
}: VideoPlayerProps) => {
  const urlExtension = getVideoExtention(src);

  if (!SUPPORTED_VIDEOS.includes(urlExtension.toLowerCase())) {
    return <EmbedVideo src={src} />;
  }

  return <FileVideo {...props} src={src} />;
};

export default React.forwardRef((
  props: VideoPlayerProps, ref?: React.MutableRefObject<VideoPlayerRef>,
) => (
  <VideoPlayer videoRef={ref} {...props} />
));
