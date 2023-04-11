import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { TextInput } from '~/baseComponents/Input';
import Text from '~/baseComponents/Text';
import useBaseHook from '~/hooks/baseHook';
import spacing from '~/theme/spacing';
import useMemberQuestionsStore from './store';

export interface Props {
  questionId: string;
}

const TextQuestion = ({ questionId }:Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const { t } = useBaseHook();

  const [answer, setAnswer] = useState('');

  const data = useMemberQuestionsStore(
    useCallback((state) => state.questions?.[questionId], [questionId]),
  );
  const actions = useMemberQuestionsStore((state) => state.actions);

  const { question, isRequired, id } = data || {};

  const onChangeText = (text: string) => {
    setAnswer(text);
  };

  const onBlur = () => {
    actions.setAnswer(id, answer);
  };

  return (
    <>
      <Text.LabelM testID="member_questions.question">
        {question}
        {isRequired && <Text.LabelM style={styles.questionRequired}>{' *'}</Text.LabelM>}
      </Text.LabelM>
      <TextInput
        testID="member_questions.answer"
        onChangeText={onChangeText}
        maxLength={700}
        placeholder={t('common:text_answer_input_placeholder')}
        onBlur={onBlur}
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
