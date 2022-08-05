import React, { FC } from 'react';
import {
  View, Text, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import NodeEmoji from 'node-emoji';

export interface TextEmojiIconProps {
  style?: StyleProp<ViewStyle>;
  name?: string;
}

const TextEmojiIcon: FC<TextEmojiIconProps> = ({
  name,
  style,
}: TextEmojiIconProps) => {
  const styles = createStyle();

  const emoji = NodeEmoji.find(name || '')?.emoji;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fontSize = (style?.width || 12) * 0.75;

  return (
    <View style={[styles.container, style]}>
      <Text style={{ fontSize, textAlignVertical: 'bottom' }}>{emoji}</Text>
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextEmojiIcon;
