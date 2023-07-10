import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import {
  EditQuestionForm, EditQuizActionsParams, IQuiz, QuestionItem,
} from '~/interfaces/IQuiz';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useQuizzesStore from '~/store/entities/quizzes';
import showAlert from '~/store/helper/showAlert';
import showToastSuccess from '~/store/helper/showToastSuccess';

const useEditQuestion = (
  quiz: IQuiz, questionIndex: number,
) => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const { questions, id, contentId } = quiz || {};
  const questionItem = questions?.[questionIndex];

  if (!questionItem) return { hasQuestion: false };

  const post = usePostsStore(postsSelector.getPost(contentId, {}));
  const { audience } = post;
  const { groups = [] } = audience || {};

  const loading = useQuizzesStore((state) => state.loading);
  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);

  const { question, answers } = questionItem;

  const methods = useForm<EditQuestionForm>({
    defaultValues: {
      question,
      answers,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;

  const enabledBtnSave = isValid && !loading && isDirty;

  const removeQuestion = () => {
    const newQuestions = questions.filter((_quest, index) => index !== questionIndex);
    const editQuizActionsParams: EditQuizActionsParams = {
      idQuiz: id,
      params: {
        questions: newQuestions,
      },
      audiences: groups,
    };

    actionsQuizzesStore.editQuiz(editQuizActionsParams);
    rootNavigation.goBack();
  };

  const onRemoveQuestion = () => {
    showAlert({
      title: t('quiz:alert_title_delete_question', { number: questionIndex + 1 }),
      content: t('quiz:alert_content_delete_question', { number: questionIndex + 1 }),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
      confirmBtnProps: { type: 'ghost' },
      onConfirm: removeQuestion,
    });
  };

  const onSave = handleSubmit((data) => {
    const { question: questionData, answers: answersData } = data;

    const onSuccess = (response: IQuiz) => {
      showToastSuccess(response);
      rootNavigation.goBack();
    };

    const newQuestionItem: QuestionItem = {
      ...questionItem,
      question: questionData,
      answers: answersData,
    };
    const newQuestions = questions.map((quest, index) => {
      if (index === questionIndex) {
        return newQuestionItem;
      }
      return quest;
    });
    const editQuizActionsParams: EditQuizActionsParams = {
      idQuiz: id,
      params: {
        questions: newQuestions,
      },
      audiences: groups,
      onSuccess,
    };

    actionsQuizzesStore.editQuiz(editQuizActionsParams);
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
    hasQuestion: true,
    methods,
    onSave,
    onRemoveQuestion,
    handleBack,
    enabledBtnSave,
  };
};

export default useEditQuestion;
