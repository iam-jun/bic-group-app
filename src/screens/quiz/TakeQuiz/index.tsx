import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Platform,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import showAlert from '~/store/helper/showAlert';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';
import AnswerItem from './components/AnswerItem';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';

interface TakeQuizProps {}

const BOTTOM_SPACE = Platform.OS === 'ios' ? 38 : 24;

const TakeQuiz: React.FC<TakeQuizProps> = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const [answerCorrect, setAnswerCorrect] = useState<any>({});

  const goBack = () => rootNavigation.goBack();

  const onPressBack = () => {
    showAlert({
      title: t('quiz:alert_title_discard_quiz'),
      content: t('quiz:alert_content_discard_quiz'),
      cancelBtn: true,
      confirmLabel: t('quiz:btn_exit'),
      onConfirm: goBack,
    });
  };

  useBackPressListener(onPressBack);

  const onPressNext = () => {
    rootNavigation.navigate(quizStack.takeQuizReview);
  };

  const onPickAnswer = (data) => {
    setAnswerCorrect(data);
  };

  const rendeAnswerItem = (item, index) => {
    const isCorrect = answerCorrect?.id === item.id;

    return (
      <AnswerItem
        data={item}
        onPress={onPickAnswer}
        index={index}
        key={item.id}
        isCorrect={isCorrect}
      />
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white} testID="take_quiz">
      <Header
        titleTextProps={{ useI18n: true }}
        title="quiz:title_take_quiz"
        onPressBack={onPressBack}
      />
      <ScrollView>
        <View style={styles.content}>
          <Text.SubtitleXS color={colors.neutral30}>
            QUESTION 1 OF 1
          </Text.SubtitleXS>
          <View style={styles.questionContainer}>
            <Text.H4 color={colors.neutral60}>
              This is test question fake data, right ?
            </Text.H4>
          </View>
          {fakeAnswers.map(rendeAnswerItem)}
        </View>
      </ScrollView>
      <Button.Primary
        size="large"
        useI18n
        onPress={onPressNext}
        style={styles.btnNext}
      >
        quiz:btn_next
      </Button.Primary>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.padding.large,
    paddingTop: spacing.padding.extraLarge,
  },
  questionContainer: {
    marginTop: spacing.margin.base,
    marginBottom: spacing.margin.large,
  },
  btnNext: {
    marginTop: spacing.margin.base,
    marginBottom: BOTTOM_SPACE,
    marginHorizontal: spacing.margin.large,
  },
});

export default TakeQuiz;

const fakeAnswers = [
  {
    answer: 'Vàng và thiếc',
    id: 'ac50b926-a1f6-413e-a6da-ac1d1d595193',
  },
  {
    answer: 'Vàng và kim cương',
    id: '78db5d50-0beb-4235-b125-8abd254b5063',
  },
  {
    answer: 'Vàng và FAIENCE',
    id: 'ac50b926-a1f6-413e-a6da-ac1d1d591212',
  },
  {
    answer: 'Gold và Diamond',
    id: 'ac50b926-a1f6-413e-a6da-acfdgd595193',
  },
  {
    answer: 'Iron và Metan',
    id: 'ac50b926-a1f6-413e-a6da-acfdgd59393',
  },

];
