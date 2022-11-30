import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import PostInput from '~/beinComponents/inputs/PostInput';

export interface EditArticleContentProps {
  useEditArticleData: any;
  mentionInputRef: any;
  refTextInput: any;
}

const EditArticleContent: FC<EditArticleContentProps> = ({
  useEditArticleData, mentionInputRef, refTextInput,
}: EditArticleContentProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    loading, content, groupIds, handleContentChange,
  } = useEditArticleData || {};

  const onChangeContent = debounce((value) => {
    handleContentChange(value);
  }, 500);

  return (
    <ScrollView bounces={false} keyboardShouldPersistTaps="always">
      <MentionInput
        disableAutoComplete
        groupIds={groupIds}
        mentionInputRef={mentionInputRef}
        style={styles.flex1}
        ComponentInput={PostInput}
        componentInputProps={{
          value: content,
          onChangeText: onChangeContent,
          inputRef: refTextInput,
          scrollEnabled: false,
        }}
        disabled={loading}
      />
    </ScrollView>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      backgroundColor: colors.neutral,
    },
  });
};

export default EditArticleContent;
