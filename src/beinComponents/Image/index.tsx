import React, {useEffect, useState} from 'react';
import {ImageStyle} from 'react-native';
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
  placeholderSource?: any;
  placeholderStyle?: StyleProp<ViewStyle>;
  PlaceholderComponent?: any;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ImageStyle>;
  ImageComponent?: any;
  onError?: (err: any) => void;
  useOnLayoutSize?: boolean;
  [x: string]: any;
}

const Image: React.FC<ImageProps> = ({
  source,
  placeholderSource,
  placeholderStyle,
  PlaceholderComponent,
  containerStyle,
  style,
  ImageComponent = FastImage,
  onError,
  useOnLayoutSize,
  ...props
}: ImageProps) => {
  const [layoutSizeStyle, setLayoutSizeStyle] = useState({width: 0, height: 0});

  const placeholderContainerOpacity = React.useRef(
    new Animated.Value(1),
  ).current;

  const [_source, setSource] = useState(source);

  useEffect(() => {
    updateSource(source);
  }, [source]);

  const _onError = (error: any) => {
    if (onError) return onError(error);
    placeholderSource && updateSource(placeholderSource);
  };

  const updateSource = (source: any) => {
    if (
      typeof source === 'string' &&
      source.toLowerCase?.().startsWith?.('http')
    ) {
      setSource({uri: source});
    } else {
      setSource(source);
    }
  };

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

  const onLayout = (e: any) => {
    const {width, height} = e?.nativeEvent?.layout || {};
    if (width) {
      setLayoutSizeStyle({width, height});
    }
  };

  if (useOnLayoutSize && !layoutSizeStyle.width) {
    return <View style={{width: '100%', height: '100%'}} onLayout={onLayout} />;
  }

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

            <ImageComponent
              source={_source}
              {...props}
              style={StyleSheet.flatten([
                useOnLayoutSize ? layoutSizeStyle : {},
                style,
              ])}
              onError={_onError}
            />
          </React.Fragment>
        ),
        ios: (
          <React.Fragment>
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
            <ImageComponent
              source={_source}
              {...props}
              onLoadEnd={onLoadEnd}
              onError={_onError}
              style={StyleSheet.flatten([
                useOnLayoutSize ? layoutSizeStyle : {},
                style,
              ])}
            />
          </React.Fragment>
        ),
        web: (
          <ImageComponent
            source={_source}
            {...props}
            style={StyleSheet.flatten([
              useOnLayoutSize ? layoutSizeStyle : {},
              style,
            ])}
          />
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
