import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import showAlert from '~/store/helper/showAlert';

export type FormGenerateQuiz = {
    title: string
    description?: string
    question: number | null
    answer: number | null
    questionDisplay?: number | null
    answerDisplay?: number | null
}
const useGenerateQuiz = () => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const {
    control, watch, handleSubmit, formState: { isValid, isDirty }, trigger,
  } = useForm<FormGenerateQuiz>({
    defaultValues: {
      title: '',
      description: '',
      question: null,
      answer: null,
      questionDisplay: null,
      answerDisplay: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const enabledBtnNext = isValid;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onNext = handleSubmit((data) => {
    // do something
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
    enabledBtnNext,
    onNext,
    trigger,
    handleBack,
  };
};

export default useGenerateQuiz;
