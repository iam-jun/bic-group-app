import React, { FC } from 'react';
import {
  View, Text, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import NodeEmoji from 'node-emoji';

export interface TextEmojiIconProps {
  style?: StyleProp<ViewStyle>;
  name?: string;
}

const TextEmojiIcon: FC<TextEmojiIconProps> = ({
  name,
  style,
}: TextEmojiIconProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const emoji = NodeEmoji.find(name || '')?.emoji;

  // @ts-ignore
  const fontSize = (style?.width || 12) * 0.75;

  return (
    <View style={[styles.container, style]}>
      <Text style={{ fontSize, textAlignVertical: 'bottom' }}>{emoji}</Text>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextEmojiIcon;
