import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { PermissionKey } from '~/constants/permissionScheme';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import showAlert from '~/store/helper/showAlert';
import useMyPermissionsStore from '~/store/permissions';
import { showAlertAudienceListWithNoPermissionQuiz } from '../helper';
import { FormGenerateQuiz } from '~/interfaces/IQuiz';

const useGenerateQuiz = (postId: string) => {
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
      title: '',
      description: '',
      numberOfQuestions: null,
      numberOfAnswers: null,
      numberOfQuestionsDisplay: null,
      numberOfAnswersDisplay: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const post = usePostsStore(postsSelector.getPost(postId, {}));

  const { audience } = post;
  const groupAudience = audience?.groups || [];

  const loadingGetPermissions = useMyPermissionsStore((state) => state.loading);
  const { getMyPermissions, getAudienceListWithNoPermission }
    = useMyPermissionsStore((state) => state.actions);

  const enabledBtnNext = isValid;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkPermissions = async (data: FormGenerateQuiz) => {
    await getMyPermissions();
    const audienceListWithNoPermissionQuiz = getAudienceListWithNoPermission(
      groupAudience,
      PermissionKey.CUD_QUIZ,
    );

    if (audienceListWithNoPermissionQuiz.length > 0) {
      showAlertAudienceListWithNoPermissionQuiz(
        audienceListWithNoPermissionQuiz,
      );
    } else {
      // do next
    }
  };

  const onNext = handleSubmit((data) => {
    checkPermissions(data);
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
    loadingGetPermissions,
    onNext,
    trigger,
    handleBack,
  };
};

export default useGenerateQuiz;
