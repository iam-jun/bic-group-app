import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image as RNImage,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatText} from '~/utils/format';
import TextContent from '../Text/TextContent';
import ThemeView from '../ThemeView/ThemeView';

// Depend on FastImage.resizeMode
export const resizeModes = {
  cover: FastImage.resizeMode.cover,
  center: FastImage.resizeMode.center,
  contain: FastImage.resizeMode.contain,
  stretch: FastImage.resizeMode.stretch,
};

// Depend on FastImage.cacheControl
export const cacheControl = {
  immutable: FastImage.cacheControl.immutable, // Only updates if url changes.
  cacheOnly: FastImage.cacheControl.cacheOnly, // Use headers and follow normal caching procedures.
  web: FastImage.cacheControl.web, // Only show images from cache, do not make any network requests.
};

/**
 * Represents a Image.
 * @constructor
 * @param {object} style - (Optional) Style of container image.
 * @param {int} width - (Optional) Image's width
 * @param {int} height - (Optional) Image's height
 * @param {string} source - (Required) Asset, local or network source
 */

function getUriImage(uri: string) {
  return uri !== null &&
    uri !== undefined &&
    typeof uri === 'string' &&
    uri.includes('/') &&
    uri.includes('.')
    ? uri
    : '';
}

export interface Props {
  style?: any;
  width?: any;
  height?: any;
  source?: any;
  resizeMode?: any;
  cache?: any;
  isLoading?: any;
  percentage?: any;
}

const Image: React.FC<Props> = ({
  style,
  width = '100%',
  height,
  source,
  resizeMode = resizeModes.cover,
  cache = cacheControl.immutable,
  isLoading,
  percentage,
  ...props
}) => {
  if (!source?.uri)
    return (
      <ThemeView color="grey5" style={[styles.container, style, {height}]} />
    );

  return (
    <ThemeView color="black" style={[styles.container, style]}>
      <FastImage
        {...props}
        style={[styles.container, {width, height}, style]}
        source={{uri: getUriImage(source.uri), cache}}
        resizeMode={resizeMode}
      />
      {!!isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          {!!percentage && (
            <TextContent style={styles.loadingText}>
              {formatText('LABEL_UPLOADING', percentage)}
            </TextContent>
          )}
        </View>
      )}
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'white',
  },
});

export default React.memo(Image);
