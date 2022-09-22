import React, { FC, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import EmojiNameToast from './components/EmojiNameToast';
import EmojiPicker from '~/baseComponents/EmojiPicker';

export interface ReactionViewProps {
  onPressReaction: (key: string) => void;
}

const SelectReactionView: FC<ReactionViewProps> = ({
  onPressReaction,
}: ReactionViewProps) => {
  const emojiRef = useRef<any>();

  return (
    <View style={styles.container}>
      <EmojiPicker
        testID="add_reaction.emoji_picker"
        onEmojiPress={onPressReaction}
      />
      <EmojiNameToast testID="select_reaction_view.emoji_name_toast" toastRef={emojiRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SelectReactionView;
