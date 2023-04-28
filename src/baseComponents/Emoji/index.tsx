import React, { FC } from 'react';
import {
  Image, ImageStyle, Platform, StyleProp, StyleSheet, TextStyle,
} from 'react-native';
import { EmojiIndicesByAlias, Emojis } from './emojis';

import { getCustomEmojisByName } from '~/utils/emojis';
import Text from '../Text';

export type EmojiProps = {
  testID?: string;
  emojiName: string;
  size?: number;
  textStyle?: StyleProp<TextStyle>;
  customEmojiStyle?: StyleProp<ImageStyle>;
}

const Emoji: FC<EmojiProps> = ({
  testID,
  emojiName,
  customEmojiStyle,
  size,
  textStyle,
}) => {
  if (!size && textStyle) {
    const flatten = StyleSheet.flatten(textStyle);
    size = flatten.fontSize;
  }

  const renderImageEmoji = (assetImage: any) => {
    const width = size * 1.2;
    const height = size * 1.2;
    const key = Platform.OS === 'android' ? (`${emojiName}-${height}-${width}`) : null;

    return (
      <Image
        testID={testID || 'emoji.image'}
        key={key}
        source={assetImage}
        style={[customEmojiStyle, { width, height }]}
        resizeMode="contain"
      />
    );
  };

  const renderUnicodeEmoji = (unicode: string) => {
    const codeArray = unicode.split('-');
    const code = codeArray.reduce((acc, c) => acc + String.fromCodePoint(parseInt(c, 16)), '');

    return (
      <Text
        testID={testID || 'emoji.unicode'}
        allowFontScaling
        adjustsFontSizeToFit
        style={[textStyle, {
          fontSize: size,
          color: '#000',
          fontWeight: 'bold',
        }]}
      >
        {code}
      </Text>
    );
  };

  const customEmoji = getCustomEmojisByName(emojiName);

  if (customEmoji) {
    return renderImageEmoji(customEmoji.path);
  }

  if (EmojiIndicesByAlias.has(emojiName)) {
    const emoji = Emojis[EmojiIndicesByAlias.get(emojiName)!];
    // if (emoji.category === 'custom') {
    //   return renderImageEmoji(emoji.fileName);
    // }
    return renderUnicodeEmoji(emoji.image);
  }

  return null;
};

export default React.memo(Emoji);
