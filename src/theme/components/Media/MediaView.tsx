import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ImagePreviewer from '../Image/ImagePreviewer';

export interface Props {
  uri?: any;
  style?: any;
  type?: any;
}

const MediaView: React.FC<Props> = ({type, uri, style, ...props}) => {
  return (
    <ImagePreviewer {...props} style={[styles.media, style]} source={{uri}} />
  );
};

const styles = StyleSheet.create({
  media: {
    width: '100%',
    height: 200,
  },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlay: {
    position: 'absolute',
  },
});

export default MediaView;
