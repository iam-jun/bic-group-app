import React, {FC} from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import NodeEmoji from 'node-emoji';

import {ITheme} from '~/theme/interfaces';

export interface TextEmojiIconProps {
  style?: StyleProp<ViewStyle>;
  name?: string;
}

const TextEmojiIcon: FC<TextEmojiIconProps> = ({
  name,
  style,
}: TextEmojiIconProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const emoji = NodeEmoji.find(name || '')?.emoji;

  // @ts-ignore
  const fontSize = (style?.width || 12) * 0.85;

  return (
    <View style={[styles.container, style]}>
      <Text style={{fontSize, textAlignVertical: 'bottom'}}>{emoji}</Text>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default TextEmojiIcon;
