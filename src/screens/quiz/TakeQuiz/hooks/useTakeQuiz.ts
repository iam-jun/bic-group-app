import { useEffect } from "react";
import { useRootNavigation } from "~/hooks/navigation";
import useTakeQuizStore from "../store";
import usePostsStore from "~/store/entities/posts";
import postsSelector from "~/store/entities/posts/selectors";
import quizStack from "~/router/navigator/MainStack/stacks/quizStack/stack";
import { IPayLoadUpdateAnwsers, TakingAnswerItem } from '~/interfaces/IQuiz';
import { isEqual } from "lodash";
import { mapQuestionReview } from './helper';

const useTakeQuiz = (quizId: string, contentId: string) => {
  const { rootNavigation } = useRootNavigation();

  const contentData = usePostsStore(postsSelector.getPost(contentId, {}));
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
  } = participantResult || {};
  const currentQuestion = questions?.[currentQuestionIndex];
  const questionChoosedAnswer = userAnswers?.find((item) => item?.questionId === currentQuestion?.id);
  const totalQuestion = questions?.length || 0;
  const enableButtonPrevious = currentQuestionIndex !== 0;
  const canAutoSave = !isEqual(userAnswers, userAnswersResult);
  const questionReviews = mapQuestionReview(userAnswers, questions);

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
    if (canAutoSave) {
      saveAnwsers();
    }
  }, [userAnswers]);

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
    const payload = {
      isFinished,
      quizParticipantId: currentParticipant,
      answers,
    } as IPayLoadUpdateAnwsers;

    if (answers && answers?.length !== 0 && currentParticipant) {
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
    rootNavigation.navigate(quizStack.takeQuizResult);
  };


  // check phần countdount hết giờ auto submit và chuyển screen
  // check lại phần lấy particiantid bằng cách get content detail thay vì lưu cache...


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
  };
};

export default useTakeQuiz;
