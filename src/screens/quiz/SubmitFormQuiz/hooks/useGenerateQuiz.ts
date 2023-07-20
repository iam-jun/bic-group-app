import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import showAlert from '~/store/helper/showAlert';
import {
  buildGenerateQuizParams,
} from '../helper';
import {
  EditQuizActionsParams,
  FormGenerateQuiz,
  GenerateQuizParams,
  IQuiz,
  QuizStatus,
} from '~/interfaces/IQuiz';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import useQuizzesStore from '~/store/entities/quizzes';
import showToastSuccess from '~/store/helper/showToastSuccess';

const useGenerateQuiz = (
  contentId: string,
  initFormData?: FormGenerateQuiz,
) => {
  const {
    title = '',
    description = '',
    numberOfQuestions = '10',
    numberOfAnswers = '4',
    numberOfQuestionsDisplay = null,
    numberOfAnswersDisplay = null,
  } = initFormData || {};
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid, isDirty },
    trigger,
  } = useForm<FormGenerateQuiz>({
    defaultValues: {
      title,
      description,
      numberOfQuestions, // use string instead of number for display in input text
      numberOfAnswers, // use string instead of number for display in input text
      numberOfQuestionsDisplay,
      numberOfAnswersDisplay,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const isGenerating = useQuizzesStore((state) => state.isGenerating);
  const loading = useQuizzesStore((state) => state.loading);
  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);

  const post = usePostsStore(postsSelector.getPost(contentId, {}));

  const { audience } = post;
  const groupAudiences = audience?.groups || [];

  const isFormValid = isValid;

  const generateQuiz = async (data: FormGenerateQuiz) => {
    const formParams = buildGenerateQuizParams(data, contentId);
    const params: GenerateQuizParams = {
      contentId: formParams.contentId,
      numberOfQuestions: formParams.numberOfQuestions,
      numberOfAnswers: formParams.numberOfAnswers,
    };
    const onSuccess = (quiz: IQuiz) => {
      const { id } = quiz;
      rootNavigation.replace(quizStack.composeQuiz, { quizId: id });
    };
    actionsQuizzesStore.generateQuiz(params, onSuccess);
  };

  const publishQuiz = (quizId: string, data: FormGenerateQuiz) => {
    const onSuccess = (response: any) => {
      showToastSuccess(response);
      rootNavigation.pop(2);
    };
    const formParams = buildGenerateQuizParams(data);
    const params: GenerateQuizParams = {
      title: formParams.title,
      description: formParams.description,
      numberOfQuestionsDisplay: formParams.numberOfQuestionsDisplay,
    };
    const editQuizActionsParams: EditQuizActionsParams = {
      quizId,
      params: {
        ...params,
        status: QuizStatus.PUBLISHED,
      },
      audiences: groupAudiences,
      onSuccess,
    };

    actionsQuizzesStore.editQuiz(editQuizActionsParams);
  };

  const onNext = handleSubmit((data) => {
    generateQuiz(data);
  });

  const onPublish = (quizId: string) => handleSubmit((data) => {
    publishQuiz(quizId, data);
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
    control,
    watch,
    isFormValid,
    isGenerating,
    loading,
    onNext,
    onPublish,
    trigger,
    handleBack,
  };
};

export default useGenerateQuiz;
