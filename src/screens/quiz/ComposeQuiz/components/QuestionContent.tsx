import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/baseComponents/Text';
import { AnswerItem, QuestionItem } from '~/interfaces/IQuiz';
import { spacing } from '~/theme';
import { mapIndexToAlphabet } from '../../helper';

type QuestionContentProps = {
  questionItem: QuestionItem;
  isTakeQuizReview?: boolean;
};

const QuestionContent: FC<QuestionContentProps> = ({
  questionItem,
  isTakeQuizReview = false,
}) => {
  const { question, answers } = questionItem;
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const renderAnswerItem = (item: AnswerItem, index: number) => {
    const { answer, isCorrect, id } = item;
    return (
      <View key={`answer_${id}`}>
        {isCorrect ? (
          <View style={styles.container}>
            <View style={[
              styles.square,
              isTakeQuizReview ? styles.squareTakeQuizReview : styles.squareComposeQuiz,
            ]}
            >
              <Text.ButtonS
                color={isTakeQuizReview ? colors.purple50 : colors.green50}
              >
                {mapIndexToAlphabet[index]}
              </Text.ButtonS>
            </View>
            <View style={styles.textContainer}>
              <Text.BodyMMedium
                color={isTakeQuizReview ? colors.purple50 : colors.green50}
              >
                {answer}
              </Text.BodyMMedium>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <View
              style={[
                styles.square,
                {
                  backgroundColor: 'transparent',
                  justifyContent: 'flex-start',
                },
              ]}
            >
              <Text.BodyM color={colors.neutral40}>
                {mapIndexToAlphabet[index]}
              </Text.BodyM>
            </View>
            <View style={styles.textContainer}>
              <Text.BodyM color={colors.neutral40}>{answer}</Text.BodyM>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      <Text.BodyMMedium color={colors.neutral60} style={styles.titleQuestion}>
        {question}
      </Text.BodyMMedium>
      {answers.map(renderAnswerItem)}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colors } = theme;
  return StyleSheet.create({
    titleQuestion: {
      marginBottom: spacing.margin.small,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: spacing.margin.small,
    },
    square: {
      height: 28,
      width: 28,
      borderRadius: spacing.borderRadius.base,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.margin.small,
    },
    squareComposeQuiz: {
      backgroundColor: colors.green2,
    },
    squareTakeQuizReview: {
      backgroundColor: colors.purple5,
    },
    textContainer: {
      flex: 1,
    },
  });
};

export default QuestionContent;
