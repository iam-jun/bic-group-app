/* eslint-disable @typescript-eslint/no-empty-function */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { QuestionItem } from '~/interfaces/IQuiz';
import { spacing } from '~/theme';
import QuestionHeader from './QuestionHeader';
import QuestionContent from './QuestionContent';
import { useRootNavigation } from '~/hooks/navigation';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';

type QuestionComposeQuizProps = {
  quizId: string;
  questionItem: QuestionItem;
  questionIndex: number;
};

const QuestionComposeQuiz: FC<QuestionComposeQuizProps> = ({
  quizId,
  questionItem,
  questionIndex,
}) => {
  const { rootNavigation } = useRootNavigation();
  const theme = useTheme();
  const styles = createStyle(theme);

  const onPressEdit = () => {
    rootNavigation.navigate(quizStack.editQuestion, {
      questionIndex,
      quizId,
    });
  };

  return (
    <View style={styles.container}>
      <QuestionHeader questionIndex={questionIndex} onPressEdit={onPressEdit} />
      <QuestionContent questionItem={questionItem} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.extraLarge,
      paddingBottom: spacing.padding.small,
    },
  });
};

export default QuestionComposeQuiz;
