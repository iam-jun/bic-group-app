import { useEffect, useState } from 'react';
import {
  IActivityImportant,
  IAudienceUser,
  IPayloadPutEditPost,
  IPost,
  IPostCreatePost,
  IPostSetting,
} from '~/interfaces/IPost';
import usePostsStore, { IPostsState } from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { useRootNavigation } from '~/hooks/navigation';
import { isPostExpired } from '~/helpers/post';
import useCreatePostStore from '../CreatePost/store';
import {
  getMinDateImportant as getMinDate,
  getMaxDateImportant as getMaxDate,
  handleChangeSuggestDateImportant,
  handleChangeTimePickerImportant,
  handleChangeDatePickerImportant,
  toggleImportant,
} from '~/helpers/settingImportant';

export interface IUsePostSettings {
  postId?: string;
  listAudiencesWithoutPermission?: any[];
}

export const usePostSettings = (params?: IUsePostSettings) => {
  const { postId, listAudiencesWithoutPermission } = params || {};

  const { rootNavigation } = useRootNavigation();

  const putUpdateSettings = !!postId;

  const initPostData: IPost = usePostsStore(postsSelector.getPost(postId));

  const {
    important, canReact, canComment,
  } = useCreatePostStore((state) => state.createPost);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const { putEditPost } = usePostsStore((state: IPostsState) => state.actions);

  const [disableButtonSave, setDisableButtonSave] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showCustomExpire, setCustomExpire] = useState<boolean>(false);
  const [sImportant, setImportant] = useState<IActivityImportant>({
    active: false,
    expiresTime: null,
    chosenSuggestedTime: '',
    neverExpires: important.active && !important.expiresTime,
    ...important,
  });
  const [sCanReact, setCanReact] = useState<boolean>(canReact);
  const [sCanComment, setCanComment] = useState<boolean>(canComment);

  useEffect(
    () => {
      if (sCanComment !== canComment) {
        setCanComment(canComment);
      }
    }, [canComment],
  );

  useEffect(
    () => {
      if (sCanReact !== canReact) {
        setCanReact(canReact);
      }
    }, [canReact],
  );

  useEffect(
    () => {
      const isImportantChanged = important.active !== sImportant.active
      || important.expiresTime !== sImportant.expiresTime;
      if (isImportantChanged) {
        setImportant({ ...sImportant, ...important, neverExpires: important.active && !important.expiresTime });
      }
    }, [important],
  );

  useEffect(
    () => {
      checkDisableButtonSave();
    }, [sImportant, sCanComment, sCanReact],
  );

  const checkDisableButtonSave = () => {
    const isImportantChanged = important.active !== sImportant.active
    || important.expiresTime !== sImportant.expiresTime;
    const dataCount = [
      !isImportantChanged,
      sCanComment === canComment,
      sCanReact === canReact,
      //   shares,
    ];

    const newCount = dataCount.filter((i) => !i);
    setDisableButtonSave(newCount.length === 0);
  };

  const handleToggleImportant = () => {
    toggleImportant(
      listAudiencesWithoutPermission,
      sImportant,
      setImportant,
      setShowWarning,
    );
  };

  const handleToggleCanComment = () => {
    setCanComment(!sCanComment);
  };

  const handleToggleCanReact = () => {
    setCanReact(!sCanReact);
  };

  const handleChangeDatePicker = (date?: Date) => {
    handleChangeDatePickerImportant(
      date,
      sImportant,
      setImportant,
    );
  };

  const handleChangeTimePicker = (time?: Date) => {
    handleChangeTimePickerImportant(
      time,
      sImportant,
      setImportant,
    );
  };

  // update setting post from option Edit Post Settings on menu post
  const handlePutUpdateSettings = () => {
    const {
      id, content, media, setting, audience, mentions,
    } = initPostData || {};
    if (!id) {
      console.error('\x1b[31m🐣️ usePostSettings update: id not found\x1b[0m');
      return 'doNothing';
    }

    const userIds: string[] = [];
    const groupIds: string[] = [];
    const audienceIds = { groupIds, userIds };
    audience?.users?.map?.((u: IAudienceUser) => !!u?.id && userIds.push(u.id || ''));
    audience?.groups?.map?.((u: IAudienceUser) => !!u?.id && groupIds.push(u.id || ''));

    const newSettings: IPostSetting = { ...setting };
    newSettings.isImportant = sImportant?.active;
    newSettings.importantExpiredAt = sImportant?.active
      ? sImportant?.expiresTime
      : null;
    newSettings.canComment = sCanComment;
    newSettings.canReact = sCanReact;

    const data: IPostCreatePost = {
      content,
      media,
      setting: newSettings,
      audience: audienceIds,
      mentions,
    };
    const payload: IPayloadPutEditPost = {
      id,
      data,
      disableNavigate: true,
      onRetry: () => putEditPost(payload),
      isHandleSeriesTagsError: false,
      isRefresh: false,
      isCreatingNewPost: false,
    };
    putEditPost(payload);
    rootNavigation.goBack();
    return 'dispatchPutEditPost';
  };

  const handleChangeSuggestDate = (chooseDate: any) => {
    handleChangeSuggestDateImportant(
      chooseDate,
      sImportant,
      setImportant,
      setCustomExpire,
    );
  };

  const handlePressSave = () => {
    if (putUpdateSettings) {
      handlePutUpdateSettings();
      return 'putUpdateSettings';
    }
    const isExpired = isPostExpired(sImportant?.expiresTime) || sImportant.neverExpires;

    const dataDefault = [
      !isExpired,
      !sCanComment,
      !sCanReact,
    ];

    const newCount = dataDefault.filter((i) => !!i);
    createPostStoreActions.updateCreatePost({
      important: { active: sImportant.active, expiresTime: sImportant.expiresTime },
      canComment: sCanComment,
      canReact: sCanReact,
      count: newCount?.length || 0,
    });
    rootNavigation.goBack();
    return 'setCreatePostSettings';
  };

  return {
    sImportant,
    disableButtonSave,
    showWarning,
    sCanComment,
    sCanReact,
    showCustomExpire,
    handlePressSave,
    handleToggleImportant,
    handleToggleCanComment,
    handleToggleCanReact,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handlePutUpdateSettings,
    handleChangeSuggestDate,
    getMinDate,
    getMaxDate,
  };
};
