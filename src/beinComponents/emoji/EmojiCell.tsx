import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import NodeEmoji from 'node-emoji';

import Text from '~/beinComponents/Text';
import { useKeySelector } from '~/hooks/selector';

const EmojiCell = ({
  emoji, colSize, onLongPress, ...other
}: any) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const charFromUtf16 = (utf16: any) => String.fromCodePoint(...utf16.split('-').map((u: any) => `0x${u}`));
  const charFromEmojiObject = (obj: any) => charFromUtf16(obj.unified);

  const emojiKey = NodeEmoji.find(charFromEmojiObject(emoji))?.key || '';

  const _onLongPress = () => {
    onLongPress?.(emojiKey);
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!isInternetReachable}
        style={{
          width: colSize,
          height: colSize,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onLongPress={_onLongPress}
        {...other}
      >
        <Text
          testID="emoji_cell"
          style={{
            color: '#FFFFFF',
            fontSize: (colSize - 12) * 0.7,
          }}
        >
          {charFromEmojiObject(emoji)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmojiCell;
