import { useEffect } from "react";
import { useRootNavigation } from "~/hooks/navigation";
import useTakeQuizStore from "../store";
import usePostsStore from "~/store/entities/posts";
import postsSelector from "~/store/entities/posts/selectors";
import quizStack from "~/router/navigator/MainStack/stacks/quizStack/stack";
import { IPayLoadUpdateAnwsers, TakingAnswerItem } from '~/interfaces/IQuiz';
import { isEqual } from "lodash";
import { mapQuestionReview } from './helper';
import useCountDown from "./useCountDown";

const useTakeQuiz = (quizId: string, contentId: string) => {
  const { rootNavigation } = useRootNavigation();

  const contentData = usePostsStore(postsSelector.getPost(contentId, {}));
  const postActions = usePostsStore((state) => state.actions);
  const actions = useTakeQuizStore((state) => state.actions);
  const resetDataTakingQuiz = useTakeQuizStore((state) => state.actions.resetDataTakingQuiz);
  const {
    isPrepareTakingQuiz,
    quizParticipants,
    takingQuiz,
    participantResult,
  } = useTakeQuizStore((state) => state);

  const { quizDoing } = contentData || {};
  // participantDoingId only available in 30 minutes
  const { quizParticipantId: participantDoingId } = quizDoing || {};
  const currentParticipant = participantDoingId || quizParticipants[quizId];

  const { currentQuestionIndex, userAnswers } = takingQuiz || {};
  const {
    questions,
    userAnswers: userAnswersResult,
    startedAt,
    timeLimit,
    content,
    finishedAt,
  } = participantResult || {};
  const { type } = content || {};
  const currentQuestion = questions?.[currentQuestionIndex];
  const questionChoosedAnswer = userAnswers?.find((item) => item?.questionId === currentQuestion?.id);
  const totalQuestion = questions?.length || 0;
  const enableButtonPrevious = currentQuestionIndex !== 0;
  const canAutoSave = !isEqual(userAnswers, userAnswersResult);
  const questionReviews = mapQuestionReview(userAnswers, questions);

  const { timer, minutes, seconds } = useCountDown(startedAt, timeLimit);

  console.log('minutes ---: ', minutes);
  console.log('seconds ---: ', seconds);

  useEffect(() => {
    if (!currentParticipant) {
      startTakeQuiz();
    } else {
      getCurrentQuizParticipant();
    }
  }, [quizId]);

  useEffect(() => {
    initDataUserAnswer();
  }, [userAnswersResult]);

  // auto save when user pick answer
  useEffect(() => {
    if (canAutoSave && !finishedAt) {
      saveAnwsers();
    }
  }, [userAnswers, finishedAt]);

  // auto submit and get result when time up
  useEffect(() => {
    if (minutes <= 0 && seconds <= 0 && !finishedAt) {
      onSubmit();
    }

    if (!!finishedAt) {
      clearInterval(timer.current);
    }
  }, [minutes, seconds, finishedAt]);

  const initDataUserAnswer = () => {
    actions.setUserAnswersData(userAnswersResult);
  }

  const startTakeQuiz = () => {
    const onSuccess = (quizParticipantId: string) => {
      actions.getQuizParticipant(quizParticipantId);
    }

    actions.startQuiz({ quizId, onSuccess });
  }

  const saveAnwsers = (isFinished = false) => {
    const answers = useTakeQuizStore.getState().takingQuiz.userAnswers;
    const canSave = answers && answers?.length !== 0 && currentParticipant || isFinished;
    const payload = {
      isFinished,
      quizParticipantId: currentParticipant,
      answers,
    } as IPayLoadUpdateAnwsers;

    if (canSave) {
      actions.updateAnwsers(payload);
    }
  };

  const getCurrentQuizParticipant = () => {
    actions.getQuizParticipant(currentParticipant);
  };

  const onPressNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      rootNavigation.navigate(quizStack.takeQuizReview, {
        quizId,
        contentId,
      });
    } else {
      actions.onNext();
    }
  };

  const onPressPreviousQuestion = () => {
    if (enableButtonPrevious) {
      actions.onPrevious();
    }
  };

  const onPickAnswer = (data: TakingAnswerItem) => {
    actions.addToUserAnswers({
      questionId: currentQuestion?.id,
      answerId: data?.id,
    });
  };

  const onSubmit = () => {
    saveAnwsers(true);
    postActions.getContentDetail(contentId, type);
    clearDataTakeQuiz();
    rootNavigation.navigate(quizStack.takeQuizResult, {
      quizId,
      contentId,
    });
  };

  const clearDataTakeQuiz = () => {
    actions.clearQuizParticipantId(quizId);
    actions.resetDataTakingQuiz();
    clearInterval(timer.current);
  }

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
    resetDataTakingQuiz,
    questionReviews,
    clearDataTakeQuiz,
  };
};

export default useTakeQuiz;
