import { useEffect } from 'react';
import { isEqual } from 'lodash';
import { useRootNavigation } from '~/hooks/navigation';
import useTakeQuizStore from '../store';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import { IPayLoadUpdateAnwsers, ISaveAnswerTakeQuiz, TakingAnswerItem } from '~/interfaces/IQuiz';
import { mapQuestionReview } from './helper';
import useCountDown from './useCountDown';

const useTakeQuiz = (quizId: string, contentId: string) => {
  const { rootNavigation } = useRootNavigation();

  const contentData = usePostsStore(postsSelector.getPost(contentId, {}));
  const postActions = usePostsStore((state) => state.actions);
  const actions = useTakeQuizStore((state) => state.actions);
  const {
    isPrepareTakingQuiz,
    quizParticipants,
    takingQuiz,
    participantResult,
  } = useTakeQuizStore((state) => state);

  const { quizDoing } = contentData || {};
  // participantDoingId only available in timeLimit minutes
  const { quizParticipantId: participantDoingId } = quizDoing || {};
  const currentParticipantId = participantDoingId || quizParticipants[quizId];

  const { currentQuestionIndex, userAnswers } = takingQuiz[currentParticipantId] || {};
  const {
    questions,
    userAnswers: userAnswersResult,
    startedAt,
    timeLimit,
    content,
    finishedAt,
    score,
  } = participantResult[currentParticipantId] || {};
  const { type } = content || {};
  const currentQuestion = questions?.[currentQuestionIndex];
  const questionChoosedAnswer = userAnswers?.find((item) => item?.questionId === currentQuestion?.id);
  const totalQuestion = questions?.length || 0;
  const enableButtonPrevious = currentQuestionIndex !== 0;
  const canAutoSave = !isEqual(userAnswers, userAnswersResult);
  const questionReviews = mapQuestionReview(userAnswersResult, questions);

  const { timer, minutes, seconds } = useCountDown(startedAt, timeLimit);

  useEffect(() => {
    if (!currentParticipantId) {
      startTakeQuiz();
    } else {
      getCurrentQuizParticipant();
    }
  }, [quizId]);

  // auto save when user pick answer
  useEffect(() => {
    const onErrors = () => handleQuizOverTime();

    if (canAutoSave && !finishedAt) {
      saveAnwsers({ onErrors });
    }
  }, [userAnswers, finishedAt]);

  // auto submit and get result when time up
  useEffect(() => {
    if (minutes <= 0 && seconds <= 0) {
      onSubmit();
    }

    if (!!finishedAt) {
      clearInterval(timer.current);
    }
  }, [minutes, seconds, finishedAt]);

  // auto show result when quiz is finished and have score
  useEffect(() => {
    if (!!finishedAt && typeof score === 'number') {
      handleAfterFinished();
    }
  }, [finishedAt, score]);

  const startTakeQuiz = () => {
    const onNext = (quizParticipantId: string) => {
      actions.getQuizParticipant(quizParticipantId);
    };

    actions.startQuiz({ quizId, onNext });
  };

  const saveAnwsers = (options: ISaveAnswerTakeQuiz) => {
    const {
      onSuccess,
      onErrors,
      isFinished = false,
    } = options || {};

    const answers = useTakeQuizStore.getState().takingQuiz?.[currentParticipantId]?.userAnswers;
    const canSave = (answers && answers?.length !== 0 && currentParticipantId) || isFinished;
    const payload = {
      isFinished,
      quizParticipantId: currentParticipantId,
      answers,
      onSuccess,
      onErrors,
    } as IPayLoadUpdateAnwsers;

    if (canSave) {
      actions.updateAnwsers(payload);
    }
  };

  const getCurrentQuizParticipant = () => {
    actions.getQuizParticipant(currentParticipantId);
  };

  const onPressNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      rootNavigation.navigate(quizStack.takeQuizReview, {
        quizId,
        participantId: currentParticipantId,
        contentId,
      });
    } else {
      actions.onNext(currentParticipantId);
    }
  };

  const onPressPreviousQuestion = () => {
    if (enableButtonPrevious) {
      actions.onPrevious(currentParticipantId);
    }
  };

  const onPickAnswer = (data: TakingAnswerItem) => {
    actions.addToUserAnswers(currentParticipantId, {
      questionId: currentQuestion?.id,
      answerId: data?.id,
    });
  };

  const onSubmit = () => {
    // after submit should getContentDetail again to get new data
    // and clear quizDoing of content detail
    const onSuccess = () => handleAfterFinished();

    const onErrors = () => handleQuizOverTime();

    if (!finishedAt && typeof score !== 'number' && !isPrepareTakingQuiz) {
      saveAnwsers({ onSuccess, onErrors, isFinished: true });
      clearCountDownTakeQuiz();
    }
  };

  const handleQuizOverTime = () => {
    getCurrentQuizParticipant();
    handleAfterFinished();
  };

  const handleAfterFinished = () => {
    actions.clearQuizParticipantId(quizId);
    postActions.getContentDetail(contentId, type);
    navigateResult();
  };

  const navigateResult = () => {
    rootNavigation.navigate(quizStack.takeQuizResult, {
      quizId,
      participantId: currentParticipantId,
      contentId,
    });
  };

  const clearCountDownTakeQuiz = () => {
    clearInterval(timer.current);
  };

  const resetQuestionIndex = () => {
    actions.resetDataTakingQuiz(currentParticipantId);
  };

  return {
    isPrepareTakingQuiz,
    onPressNextQuestion,
    onPressPreviousQuestion,
    enableButtonPrevious,
    currentQuestionIndex,
    currentQuestion,
    totalQuestion,
    questionChoosedAnswer,
    onPickAnswer,
    onSubmit,
    resetQuestionIndex,
    questionReviews,
    clearCountDownTakeQuiz,
  };
};

export default useTakeQuiz;
