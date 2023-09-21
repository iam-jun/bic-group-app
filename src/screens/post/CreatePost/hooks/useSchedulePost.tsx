import React from "react";
import moment from 'moment';
import { isEqual } from "lodash";
import { ScheduleModal } from "~/components/ScheduleContent";
import { IPostCreatePost, PostType } from "~/interfaces/IPost";
import { SavePostParams } from "./useSavePost";
import useModalStore from "~/store/modal";
import { HandleSeriesTagsErrorParams } from "~/components/ValidateSeriesTags/store";
import usePostsStore from "~/store/entities/posts";
import postsSelector from "~/store/entities/posts/selectors";
import { useBaseHook } from "~/hooks";
import { useRootNavigation } from "~/hooks/navigation";
import useCreatePostStore from "../store";
import homeStack from "~/router/navigator/MainStack/stacks/homeStack/stack";

const useSchedulePost = (
  postId: string,
  validButtonPublish: boolean,
  validateSeriesTags: (onValidateSuccess: () => void, onError: (error: any) => void) => void,
  handleSeriesTagsError: (params: HandleSeriesTagsErrorParams) => void,
  handleSave: (options?: SavePostParams) => void,
  prepareData: () => IPostCreatePost,
) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const modalActions = useModalStore((state) => state.actions);
  const post = usePostsStore(postsSelector.getPost(postId, {}));
  const postActions = usePostsStore((state) => state.actions);
  const createPostActions = useCreatePostStore((state) => state.actions);

  // const getValidButtonConfirm = () => {
  //   const scheduleAtUpdated = useCreatePostStore.getState().schedule.scheduledAt;
  //   const validButtonConfirm = post?.scheduledAt === scheduleAtUpdated;
  //   return validButtonConfirm;
  // };

  // const validButtonConfirm = getValidButtonConfirm();

  const handleSchedule = () => {
    const scheduleAtUpdated = useCreatePostStore.getState().schedule.scheduledAt;
    const isValidScheduleTime = () => moment(scheduleAtUpdated).isSameOrAfter(moment());
    const dataCreatePost = prepareData();
    const dataSchedule = {
      ...dataCreatePost,
      scheduledAt: scheduleAtUpdated,
    };

    if (!validButtonPublish) return;
    
    if (!isValidScheduleTime()) {
      createPostActions.setErrorScheduleSubmiting(t('article:fail_schedule'));
      return;
    }

    createPostActions.schedulePost(postId, dataSchedule);
  };

  const resetScheduleData = () => {
    createPostActions.setErrorScheduleSubmiting('');
    createPostActions.setIsScheduleSubmitingSuccess(false);
    createPostActions.setScheduledAt(post?.scheduledAt || '');
  };

  const doAfterScheduleSuccess = () => {
    // use isDraft for get post detail without get comments
    postActions.getPostDetail({ postId, isDraft: true });
    rootNavigation.replace(homeStack.postReviewSchedule, { postId });
  };

  const setDateSchedule = (date: string) => {
    createPostActions.setScheduledAt(date);
  };

  const setTimeSchedule = (time: string) => {
    createPostActions.setScheduledAt(time);
  };

  const validateDataBeforeSchedule = () => {
    const doAfterResolveError = () => {
      // after resolve invalid Series Tags, need to save post
      handleSave({
        isPublish: true,
        isCreatingNewPost: false,
        onSuccess: onValidateSuccess,
      });
    };
    const onError = (error) => {
      handleSeriesTagsError({
        error,
        onNext: doAfterResolveError,
        postType: PostType.POST,
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
        contentType={PostType.POST}
        // validButtonConfirm={validButtonConfirm}
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

export default useSchedulePost;
