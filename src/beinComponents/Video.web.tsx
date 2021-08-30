import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {createElement} from 'react-native-web';
import {ITheme} from '~/theme/interfaces';

interface Props {
  source: any;
  style?: StyleProp<ViewStyle>;
  controls?: boolean;
}

const Video: React.FC<Props> = ({source, style, controls}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const createVideo = () => {
    const attrs = {
      src: source.uri || source,
      controls: controls && 'controls',
      width: style?.width || 300,
      height: style?.height || 200,
    };

    return createElement('video', attrs);
  };

  return <View style={[styles.container, style]}>{createVideo()}</View>;
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    video: {
      width: 307,
      height: 225.5,
      backgroundColor: colors.placeholder,
    },
    iconPlay: {
      position: 'absolute',
      zIndex: 1,
    },
  });
};

Video.defaultProps = {
  controls: true,
};

export default Video;
