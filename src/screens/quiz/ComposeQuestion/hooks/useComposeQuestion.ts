import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { isNumber } from 'lodash';
import { useEffect, useState } from 'react';
import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import {
  ComposeQuestionForm,
  IQuiz,
  QuestionItem,
} from '~/interfaces/IQuiz';
import useQuizzesStore from '~/store/entities/quizzes';
import showAlert from '~/store/helper/showAlert';
import { formatAnswers } from '../helper';

export type ValidateComposeQuestionError = (type: 'question' | 'answers', indexInputAnswer?: number) => void;

const initQuestion: QuestionItem = {
  content: '',
  answers: [
    {
      content: '',
      isCorrect: false,
    },
    {
      content: '',
      isCorrect: false,
    },
  ],
};

const useComposeQuestion = (quiz: IQuiz, questionIndex?: number) => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const isCreatingQuestion = !isNumber(questionIndex);

  const { questions, id: quizId } = quiz || {};
  const questionItem = isCreatingQuestion
    ? initQuestion
    : questions?.[questionIndex];

  const [needToChooseCorrectAnswer, setNeedToChooseCorrectAnswer] = useState(false);

  const loading = useQuizzesStore((state) => state.loading);
  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);

  const { content = '', answers = [], id: questionId = '' } = questionItem || {};

  const methods = useForm<ComposeQuestionForm>({
    defaultValues: {
      content,
      answers,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const {
    handleSubmit,
    formState: { isDirty },
    watch,
  } = methods;

  const answersData = watch('answers');

  const hasCorrectAnswer = answersData.some((ans) => ans.isCorrect);

  useEffect(() => {
    if (hasCorrectAnswer) {
      setNeedToChooseCorrectAnswer(false);
    }
  }, [hasCorrectAnswer]);

  const enabledBtnSave
    = !loading && isDirty;

  const removeEditQuestion = () => {
    actionsQuizzesStore.deleteQuestionQuiz(quizId, questionId);
  };

  const removeCreateQuestion = () => {
    if (isDirty) {
      showAlert({
        title: t('quiz:alert_title_delete_question', {
          number: questions.length + 1,
        }),
        content: t('quiz:alert_content_delete_question', {
          number: questions.length + 1,
        }),
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('common:btn_delete'),
        ConfirmBtnComponent: Button.Danger,
        confirmBtnProps: { type: 'ghost' },
        onConfirm: () => {
          rootNavigation.goBack();
        },
      });
    } else {
      rootNavigation.goBack();
    }
  };

  const onRemoveQuestion = () => {
    Keyboard.dismiss();
    if (isCreatingQuestion) {
      removeCreateQuestion();
    } else {
      showAlert({
        title: t('quiz:alert_title_delete_question', {
          number: questionIndex + 1,
        }),
        content: t('quiz:alert_content_delete_question', {
          number: questionIndex + 1,
        }),
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('common:btn_delete'),
        ConfirmBtnComponent: Button.Danger,
        confirmBtnProps: { type: 'ghost' },
        onConfirm: removeEditQuestion,
      });
    }
  };

  const onSave = (onValidateError: ValidateComposeQuestionError) => handleSubmit((data: ComposeQuestionForm) => {
    Keyboard.dismiss();
    if (!hasCorrectAnswer) {
      setNeedToChooseCorrectAnswer(true);
      onValidateError('answers');
      return;
    }

    const { content: contentQuestionData, answers: answersData } = data;

    const newQuestionItem: QuestionItem = {
      ...questionItem,
      content: contentQuestionData.trim(),
      answers: formatAnswers(answersData),
    };

    if (isCreatingQuestion) {
      actionsQuizzesStore.createQuestionQuiz(quizId, newQuestionItem);
    } else {
      actionsQuizzesStore.editQuestionQuiz(quizId, newQuestionItem);
    }
  }, (errors) => {
    const { content, answers } = errors;

    if (!hasCorrectAnswer) {
      setNeedToChooseCorrectAnswer(true);
    }

    if (content) {
      onValidateError('question');
      return;
    }

    if (answers) {
      const firstIndexAnswerFieldError = answers.findIndex((ans) => !!ans);

      if (firstIndexAnswerFieldError !== -1) {
        onValidateError('answers', firstIndexAnswerFieldError);
        return;
      }
    }

    if (!hasCorrectAnswer) {
      onValidateError('answers');
    }
  });

  const handleBack = () => {
    if (isDirty) {
      Keyboard.dismiss();
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => {
          rootNavigation.goBack();
        },
      });
      return;
    }
    rootNavigation.goBack();
  };

  return {
    methods,
    onSave,
    onRemoveQuestion,
    handleBack,
    enabledBtnSave,
    needToChooseCorrectAnswer,
  };
};

export default useComposeQuestion;
