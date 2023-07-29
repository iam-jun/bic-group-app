import { useEffect } from "react";
import { useRootNavigation } from "~/hooks/navigation";
import useTakeQuizStore from "../store";
import usePostsStore from "~/store/entities/posts";
import postsSelector from "~/store/entities/posts/selectors";
import quizStack from "~/router/navigator/MainStack/stacks/quizStack/stack";

const useTakeQuiz = (quizId: string, contentId: string) => {
  const { rootNavigation } = useRootNavigation();

  const contentData = usePostsStore(postsSelector.getPost(contentId, {}));
  const actions = useTakeQuizStore((state) => state.actions);
  const {
    isPrepareTakingQuiz,
    quizParticipants,
    takingQuiz,
  } = useTakeQuizStore((state) => state);

  const { quizDoing } = contentData || {};
  // participantDoingId only available in 30 minutes
  const { quizParticipantId: participantDoingId } = quizDoing || {};
  const currentParticipant = participantDoingId || quizParticipants[quizId];

  const { currentQuestionIndex, data } = takingQuiz || {};
  const { questions } = data || {};
  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestion = questions?.length || 0;
  const enableButtonPrevious = currentQuestionIndex !== 0;

  console.log('quizParticipantId: ', participantDoingId);

  useEffect(() => {
    if (!currentParticipant) {
      startTakeQuiz();
    } else {
      getCurrentQuizParticipant();
    }
  }, [quizId]);

  useEffect(() => () => actions.resetDataTakingQuiz(), []);

  const startTakeQuiz = () => {
    const onSuccess = (quizParticipantId: string) => {
      actions.getQuizParticipant(quizParticipantId);
    }

    actions.startQuiz({ quizId, onSuccess });
  }

  const getCurrentQuizParticipant = () => {
    actions.getQuizParticipant(currentParticipant);
  };

  const onPressNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      rootNavigation.navigate(quizStack.takeQuizReview);
    }
    actions.onNext();
  };

  const onPressPreviousQuestion = () => {
    if (enableButtonPrevious) {
      actions.onPrevious();
    }
  };





  return {
    isPrepareTakingQuiz,
    onPressNextQuestion,
    onPressPreviousQuestion,
    enableButtonPrevious,
    currentQuestionIndex,
    currentQuestion,
    totalQuestion,

  };
};

export default useTakeQuiz;
