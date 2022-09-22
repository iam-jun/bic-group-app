// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Image from '~/beinComponents/Image';

type Props = {

    /*
         * Emoji text name.
         */
    emojiName: string;

    /*
     * Image URL for the emoji.
     */
    imageUrl: string;

    /*
     * asset name in case it is bundled with the app
     */
    assetImage: any;

    /*
     * Set to render only the text and no image.
     */
    displayTextOnly?: boolean;
    literal?: string;
    size?: number;
    textStyle?: StyleProp<TextStyle>;
    unicode?: string;
    customEmojiStyle?: StyleProp<ImageStyle>;
    testID?: string;
}

const EmojiComponent: React.FC<Props> = (props: Props) => {
  const {
    customEmojiStyle,
    displayTextOnly,
    imageUrl,
    assetImage,
    literal,
    unicode,
    testID,
    textStyle,
  } = props;

  let { size } = props;
  let fontSize = size;
  if (!size && textStyle) {
    const flatten = StyleSheet.flatten(textStyle);
    fontSize = flatten.fontSize;
    size = fontSize;
  }

  if (displayTextOnly) {
    return (
      <Text
        style={textStyle}
        testID={testID}
      >
        {literal}
      </Text>
    );
  }

  const width = size;
  const height = size;

  if (unicode && !imageUrl) {
    const codeArray = unicode.split('-');
    const code = codeArray.reduce((acc, c) => acc + String.fromCodePoint(parseInt(c, 16)), '');

    return (
      <Text
        style={[textStyle, { fontSize: size }]}
        testID={testID}
      >
        {code}
      </Text>
    );
  }

  if (assetImage) {
    const key = Platform.OS === 'android' ? (`${assetImage}-${height}-${width}`) : null;

    return (
      <Image
        key={key}
        source={assetImage}
        style={[customEmojiStyle, { width, height }]}
        resizeMode="contain"
        testID={testID}
      />
    );
  }

  if (!imageUrl) {
    return null;
  }

  // Android can't change the size of an image after its first render, so
  // force a new image to be rendered when the size changes
  const key = Platform.OS === 'android' ? (`${imageUrl}-${height}-${width}`) : null;

  return (
    <Image
      key={key}
      testID={testID}
      style={[customEmojiStyle, { width, height }]}
      source={{ uri: imageUrl }}
      resizeMode="contain"
    />
  );
};

export default EmojiComponent;
