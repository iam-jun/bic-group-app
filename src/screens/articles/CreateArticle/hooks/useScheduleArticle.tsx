import React from 'react';
import moment from 'moment';
import { ScheduleModal } from '~/components/ScheduleContent';
import { PostType } from '~/interfaces/IPost';
import { IHandleSaveOptions } from './useCreateArticle';
import useModalStore from '~/store/modal';
import { HandleSeriesTagsErrorParams } from '~/components/ValidateSeriesTags/store';
import useCreateArticleStore from '../store';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { useBaseHook } from '~/hooks';
import useArticlesStore from '../../ArticleDetail/store';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

const useScheduleArticle = (
  articleId: string,
  validButtonPublish: boolean,
  validateSeriesTags: (onValidateSuccess: () => void, onError: (error: any) => void) => void,
  handleSeriesTagsError: (params: HandleSeriesTagsErrorParams) => void,
  handleSave: (options?: IHandleSaveOptions) => void,
) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const modalActions = useModalStore((state) => state.actions);
  const article = usePostsStore(postsSelector.getPost(articleId, {}));
  const articlesActions = useArticlesStore((state) => state.actions);
  const createArticleActions = useCreateArticleStore((state) => state.actions);

  const handleSchedule = () => {
    const scheduleAtUpdated = useCreateArticleStore.getState().schedule.scheduledAt;
    const isValidScheduleTime = () => moment(scheduleAtUpdated).isSameOrAfter(moment());

    if (!validButtonPublish) return;

    if (!isValidScheduleTime()) {
      createArticleActions.setErrorScheduleSubmiting(t('article:fail_schedule'));
      return;
    }

    createArticleActions.scheduleArticle();
  };

  const resetScheduleData = () => {
    createArticleActions.setErrorScheduleSubmiting('');
    createArticleActions.setIsScheduleSubmitingSuccess(false);
    createArticleActions.setScheduledAt(article?.scheduledAt || '');
  };

  const doAfterScheduleSuccess = () => {
    articlesActions.getArticleDetail({ articleId });
    rootNavigation.replace(articleStack.articleReviewSchedule, { articleId });
  };

  const setDateSchedule = (date: string) => {
    createArticleActions.setScheduledAt(date);
  };

  const setTimeSchedule = (time: string) => {
    createArticleActions.setScheduledAt(time);
  };

  const validateDataBeforeSchedule = () => {
    const doAfterResolveError = () => {
      // after resolve invalid Series Tags, need to save article
      handleSave({
        isNavigateBack: false,
        isShowToast: false,
        onSuccess: onValidateSuccess,
      });
    };
    const onError = (error) => {
      handleSeriesTagsError({
        error,
        onNext: doAfterResolveError,
        postType: PostType.ARTICLE,
      });
    };
    validateSeriesTags(onValidateSuccess, onError);
  };

  const handleOpenPopupSchedule = () => {
    validateDataBeforeSchedule();
  };

  const showModal = (ContentComponent: any, props: any = {}) => {
    modalActions.showModal({
      isOpen: true,
      ContentComponent,
      props,
    });
  };

  const onClose = () => {
    modalActions.hideModal();
    resetScheduleData();
  };

  const modalizeProps = {
    modalStyle: {
      paddingTop: 0,
    },
    childrenStyle: {
      zIndex: 10,
    },
  };

  const onValidateSuccess = () => {
    showModal(
      <ScheduleModal
        contentId={articleId}
        contentType={PostType.ARTICLE}
        handleSchedule={handleSchedule}
        doAfterScheduleSuccess={doAfterScheduleSuccess}
        setDateSchedule={setDateSchedule}
        setTimeSchedule={setTimeSchedule}
      />,
      {
        onClose,
        ...modalizeProps,
      },
    );
  };

  return {
    handleOpenPopupSchedule,
  };
};

export default useScheduleArticle;
