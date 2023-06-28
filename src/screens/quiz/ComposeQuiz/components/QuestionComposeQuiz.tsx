/* eslint-disable @typescript-eslint/no-empty-function */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { QuestionItem } from '~/interfaces/IQuiz';
import { spacing } from '~/theme';
import QuestionHeader from './QuestionHeader';
import QuestionContent from './QuestionContent';

type QuestionComposeQuizProps = {
  questionItem: QuestionItem;
  index: number;
};

const QuestionComposeQuiz: FC<QuestionComposeQuizProps> = ({
  questionItem,
  index,
}) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <QuestionHeader index={index} onPressEdit={() => {}} />
      <QuestionContent index={index} questionItem={questionItem} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
      paddingTop: spacing.padding.extraLarge,
      paddingBottom: spacing.padding.small,
    },
  });
};

export default QuestionComposeQuiz;
