import React from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from './FastImage';

export interface ImageProps {
  source?: any;
  placeholderStyle?: StyleProp<ViewStyle>;
  PlaceholderComponent?: any;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  ImageComponent?: any;
  [x: string]: any;
}

const Image: React.FC<ImageProps> = ({
  source,
  placeholderStyle,
  PlaceholderComponent,
  containerStyle,
  style,
  ImageComponent = FastImage,
  ...props
}: ImageProps) => {
  const placeholderContainerOpacity = React.useRef(
    new Animated.Value(1),
  ).current;

  if (
    typeof source === 'string' &&
    source.toLowerCase?.().startsWith?.('http')
  ) {
    source = {uri: source};
  }

  const onLoadEnd = () => {
    const minimumWait = 0;
    const staggerNonce = 5 * Math.random();
    setTimeout(
      () =>
        Animated.timing(placeholderContainerOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(),
      minimumWait + staggerNonce,
    );
  };
  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {Platform.select({
        android: (
          <React.Fragment>
            <View style={styles.placeholderContainer}>
              <Animated.View
                testID="Image__placeholder"
                style={StyleSheet.flatten([
                  style,
                  styles.placeholder,
                  {
                    backgroundColor: placeholderContainerOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        styles.placeholder.backgroundColor,
                        'transparent',
                      ],
                    }),
                  },
                  placeholderStyle,
                ])}>
                {PlaceholderComponent}
              </Animated.View>
            </View>

            <ImageComponent source={source} {...props} style={style} />
          </React.Fragment>
        ),
        default: (
          <React.Fragment>
            <ImageComponent
              source={source}
              {...props}
              onLoadEnd={onLoadEnd}
              style={style}
            />

            <Animated.View
              style={StyleSheet.flatten([
                styles.placeholderContainer,
                {opacity: placeholderContainerOpacity},
              ])}>
              <View
                testID="Image__placeholder"
                style={StyleSheet.flatten([
                  style,
                  styles.placeholder,
                  placeholderStyle,
                ])}>
                {PlaceholderComponent}
              </View>
            </Animated.View>
          </React.Fragment>
        ),
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Image;
