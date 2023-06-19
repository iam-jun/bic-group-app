import { useEffect, useState } from 'react';
import {
  IActivityImportant,
  IPostSetting,
  IPutEditSettingsParams,
} from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
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
import showAlert from '~/store/helper/showAlert';
import { useBaseHook } from '~/hooks';

export interface IUsePostSettings {
  postId?: string;
  listAudiencesWithoutPermission?: any[];
}

export const usePostSettings = (params?: IUsePostSettings) => {
  const { postId, listAudiencesWithoutPermission } = params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const postsStoreActions = usePostsStore((state) => state.actions);

  const {
    important, canReact, canComment,
  } = useCreatePostStore((state) => state.createPost);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const [loading, setLoading] = useState(false);
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

  const handleChangeSuggestDate = (chooseDate: any) => {
    handleChangeSuggestDateImportant(
      chooseDate,
      sImportant,
      setImportant,
      setCustomExpire,
    );
  };

  const updateStore = () => {
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
  };

  const handlePressSave = () => {
    if (!postId) return;

    const newSetting: IPostSetting = {};
    newSetting.isImportant = sImportant?.active;
    newSetting.importantExpiredAt = sImportant?.active
      ? sImportant?.expiresTime
      : null;
    newSetting.canComment = sCanComment;
    newSetting.canReact = sCanReact;

    const onPreLoad = () => {
      setLoading(true);
    };

    const onSuccess = () => {
      setLoading(false);
      updateStore();
      postsStoreActions.getPostDetail({ postId });
      rootNavigation.goBack();
    };

    const onFailed = () => {
      setLoading(false);
    };

    const params: IPutEditSettingsParams = {
      id: postId,
      setting: newSetting,
      onPreLoad,
      onSuccess,
      onFailed,
    };
    postsStoreActions.putEditSettings(params);
  };

  const handleBack = () => {
    if (disableButtonSave) {
      rootNavigation.goBack();
    } else {
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      });
    }
  };

  return {
    sImportant,
    disableButtonSave,
    loading,
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
    handleChangeSuggestDate,
    getMinDate,
    getMaxDate,
    handleBack,
  };
};
