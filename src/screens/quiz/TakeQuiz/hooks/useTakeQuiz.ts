import { useEffect } from "react";
import { isEqual } from "lodash";
import { useRootNavigation } from "~/hooks/navigation";
import useTakeQuizStore from "../store";
import usePostsStore from "~/store/entities/posts";
import postsSelector from "~/store/entities/posts/selectors";
import quizStack from "~/router/navigator/MainStack/stacks/quizStack/stack";
import { IPayLoadUpdateAnwsers, TakingAnswerItem } from '~/interfaces/IQuiz';
import { mapQuestionReview } from './helper';
import useCountDown from "./useCountDown";

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
  // participantDoingId only available in 30 minutes
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

  console.log('minutes ---: ', minutes);
  console.log('seconds ---: ', seconds);

  useEffect(() => {
    if (!currentParticipantId) {
      startTakeQuiz();
    } else {
      getCurrentQuizParticipant();
    }
  }, [quizId]);

  // useEffect(() => {
    // if (!!takingQuiz[currentParticipantId]) {
    //   initData();
    // }
  // }, [userAnswersResult]);

  // auto save when user pick answer
  useEffect(() => {
    if (canAutoSave && !finishedAt) {
      saveAnwsers();
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

  // const initData = () => {
  //   actions.setUserAnswersData(currentParticipantId, userAnswersResult);
  // }

  const startTakeQuiz = () => {
    const onSuccess = (quizParticipantId: string) => {
      actions.getQuizParticipant(quizParticipantId);
    }

    actions.startQuiz({ quizId, onSuccess });
  }

  const saveAnwsers = (isFinished = false) => {
    const answers = useTakeQuizStore.getState().takingQuiz?.[currentParticipantId]?.userAnswers;
    const canSave = answers && answers?.length !== 0 && currentParticipantId || isFinished;
    const payload = {
      isFinished,
      quizParticipantId: currentParticipantId,
      answers,
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
    if (!finishedAt && typeof score !== 'number') {
      saveAnwsers(true);
      postActions.getContentDetail(contentId, type);
      clearDataTakeQuiz();
      rootNavigation.navigate(quizStack.takeQuizResult, {
        quizId,
        participantId: currentParticipantId,
        contentId,
      });
    }
  };

  const clearDataTakeQuiz = () => {
    !!finishedAt && actions.clearQuizParticipantId(quizId);
    // actions.resetDataTakingQuiz(currentParticipantId);
    clearInterval(timer.current);
  }

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
    clearDataTakeQuiz,
  };
};

export default useTakeQuiz;
