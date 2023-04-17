import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { TextInput } from '~/baseComponents/Input';
import Text from '~/baseComponents/Text';
import useBaseHook from '~/hooks/baseHook';
import spacing from '~/theme/spacing';
import useMemberQuestionsStore from './store';

export interface Props {
  questionId: string;
  index: number;
}

const TextQuestion = ({ questionId, index }:Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const { t } = useBaseHook();

  const data = useMemberQuestionsStore(
    useCallback((state) => state.questions?.[questionId], [questionId]),
  );

  const answer = useMemberQuestionsStore((state) => state.answers?.[questionId]?.answer) || '';
  const actions = useMemberQuestionsStore((state) => state.actions);

  const { question, isRequired, id } = data || {};

  const onChangeText = (text: string) => {
    actions.setAnswer(id, text);
  };

  return (
    <>
      <Text.LabelM testID="member_questions.question">
        {`${index + 1}. ${question}`}
        {isRequired && <Text.LabelM style={styles.questionRequired}>{' *'}</Text.LabelM>}
      </Text.LabelM>
      <TextInput
        testID="member_questions.answer"
        onChangeText={onChangeText}
        maxLength={700}
        placeholder={t('common:text_answer_input_placeholder')}
      />
      <View style={styles.count}>
        <Text.BodyXS>{`${answer.length}/700`}</Text.BodyXS>
      </View>
    </>
  );
};
const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    count: {
      marginTop: spacing.margin.tiny,
      alignItems: 'flex-end',
      marginBottom: spacing.margin.large,
    },
    questionRequired: { color: colors.red40 },
  });
};

export default TextQuestion;
