import React from 'react';
import {StyleProp, StyleSheet, View, ImageStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {createElement} from 'react-native-web';
import {ITheme} from '~/theme/interfaces';

export interface ImageProps {
  source: any;
  style?: StyleProp<ImageStyle>;
  className?: string;
}

const Image: React.FC<ImageProps> = ({
  source,
  style,
  className,
}: ImageProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const createImage = () => {
    const attrs = {
      src: source?.uri || source,
      style: style,
      width: style?.width,
      height: style?.height,
      className,
    };

    return createElement('img', attrs);
  };

  return <View style={[styles.container, style]}>{createImage()}</View>;
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    video: {
      width: 300,
      height: 200,
      backgroundColor: colors.placeholder,
    },
  });
};

export default Image;
