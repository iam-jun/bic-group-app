import React from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import NodeEmoji from 'node-emoji';

import Text from '~/beinComponents/Text';
import Div from '~/beinComponents/Div';

const EmojiCell = ({emoji, colSize, onLongPress, ...other}: any) => {
  const charFromUtf16 = (utf16: any) =>
    String.fromCodePoint(...utf16.split('-').map((u: any) => '0x' + u));
  const charFromEmojiObject = (obj: any) => charFromUtf16(obj.unified);

  const emojiKey = NodeEmoji.find(charFromEmojiObject(emoji))?.key || '';

  const _onLongPress = () => {
    onLongPress?.(emojiKey);
  };

  return (
    <Div title={emojiKey}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          width: colSize,
          height: colSize,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onLongPress={_onLongPress}
        {...other}>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: (colSize - (Platform.OS === 'web' ? 0 : 12)) * 0.7,
          }}>
          {charFromEmojiObject(emoji)}
        </Text>
      </TouchableOpacity>
    </Div>
  );
};

export default EmojiCell;
