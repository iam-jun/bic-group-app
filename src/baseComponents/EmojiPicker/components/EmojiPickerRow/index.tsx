/* eslint-disable react/forbid-prop-types */
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, { FC } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Button from '~/baseComponents/Button';
import Emoji from '../../../Emoji';

interface Props {
  items: any[],
  emojiSize: number,
  emojiGutter: number,
  onEmojiPress: (name: string) => void
}

const EmojiPickerRow: FC<Props> = ({
  items, emojiSize, emojiGutter, onEmojiPress,
}) => {
  const size = emojiSize + 7;
  const itemStyle = {
    width: size,
    height: size,
    marginHorizontal: emojiGutter,
  };

  const renderEmojis = (emoji: any, index: number, emojis: any[]) => {
    const style = [
      styles.emoji,
      itemStyle,
      index === 0 && styles.emojiLeft,
      index === emojis.length - 1 && styles.emojiRight,
    ];

    if (!emoji) {
      return (
        <View
          key={index}
          style={style}
        />
      );
    }

    const name = emoji?.short_name || emoji?.name;

    return (
      <Button
        key={name}
        testID={`emoji_picker_row.emoji_button.${name}`}
        style={style}
        onPress={() => onEmojiPress(name)}
      >
        <Emoji
          testID={`emoji_picker_row.emoji.${name}`}
          emojiName={name}
          textStyle={styles.emojiText}
          size={emojiSize}
        />
      </Button>
    );
  };

  return (
    <View testID="emoji_picker_row" style={[styles.columnStyle, { marginVertical: emojiGutter }]}>
      {items.map(renderEmojis)}
    </View>
  );
};

const styles = StyleSheet.create({
  columnStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emoji: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emojiText: {
    color: '#000',
    fontWeight: 'bold',
  },
  emojiLeft: {
    marginLeft: 0,
  },
  emojiRight: {
    marginRight: 0,
  },
});

export default EmojiPickerRow;
