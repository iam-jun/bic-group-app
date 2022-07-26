import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  IActivityImportant,
  IAudienceUser,
  IPayloadPutEditPost,
  IPostActivity,
  IPostCreatePost,
  IPostSetting,
} from '~/interfaces/IPost';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import { useRootNavigation } from '~/hooks/navigation';

const MAX_DAYS = 7;

export interface IUsePostSettings {
  postId?: string;
  replaceWithDetail?: boolean;
  listAudiencesWithoutPermission?: any[];
}

export const usePostSettings = (params?: IUsePostSettings) => {
  const { postId, listAudiencesWithoutPermission } = params || {};

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const putUpdateSettings = !!postId;

  let initPostData: IPostActivity;
  if (postId) {
    initPostData = useKeySelector(postKeySelector.postById(postId));
  }

  const { important, currentSettings } = useKeySelector(
    postKeySelector.createPost.all,
  );

  const [selectingDate, setSelectingDate] = useState<boolean>();
  const [selectingTime, setSelectingTime] = useState<boolean>();
  const [disableButtonSave, setDisableButtonSave] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [sImportant, setImportant] = useState<IActivityImportant>({
    active: false,
    expires_time: '',
    ...important,
  });

  useEffect(() => {
    if (!isEqual(important, sImportant)) {
      setImportant(important);
    }
  }, [important]);

  useEffect(() => {
    checkDisableButtonSave();
  }, [sImportant]);

  const checkDisableButtonSave = () => {
    const dataCount = [
      isEqual(sImportant, important),
      //   comments,
      //   shares,
      //   reacts,
    ];
    const newCount = dataCount.filter((i) => !i);
    setDisableButtonSave(newCount.length === 0);
  };

  const handleToggleImportant = () => {
    if (!!listAudiencesWithoutPermission?.length && listAudiencesWithoutPermission.length > 0) {
      const newImportant = { ...sImportant };
      newImportant.active = !sImportant.active;
      setImportant(newImportant);
      setTimeout(() => {
        const _newImportant = { ...newImportant };
        _newImportant.active = !newImportant.active;
        setImportant(_newImportant);
        setShowWarning(true);
      }, 100);
    } else {
      const newImportant = { ...sImportant };
      newImportant.active = !sImportant.active;
      if (!newImportant.expires_time) {
        newImportant.expires_time = getMinDate().toDateString();
      }
      if (newImportant.active && newImportant.expires_time) {
        const date = new Date(newImportant.expires_time);
        if (date.getTime() < getMinDate().getTime()) {
          newImportant.expires_time = getMinDate().toISOString();
        }
      }
      if (!newImportant.active) {
        newImportant.expires_time = currentSettings?.important?.expires_time;
      }
      setImportant(newImportant);
    }
  };

  const handleChangeDatePicker = (date?: Date) => {
    setSelectingDate(false);
    setSelectingTime(false);
    if (date) {
      const newImportant = { ...sImportant };
      let expiresTime = '';
      if (date) {
        const time = sImportant.expires_time
          ? new Date(sImportant.expires_time)
          : new Date();
        date.setHours(time.getHours(), time.getMinutes(), 0, 0);
        expiresTime = date.toISOString();
        if (date.getTime() < getMinDate().getTime()) {
          expiresTime = getMinDate().toISOString();
        }
      }
      newImportant.expires_time = expiresTime;
      setImportant(newImportant);
    }
  };

  const handleChangeTimePicker = (time?: Date) => {
    setSelectingDate(false);
    setSelectingTime(false);
    if (time) {
      const newImportant = { ...sImportant };
      const date = sImportant.expires_time
        ? new Date(sImportant.expires_time)
        : new Date();

      date.setHours(time.getHours(), time.getMinutes(), 0, 0);
      let expiresTime = date.toISOString();

      if (date.getTime() < getMinDate().getTime()) {
        expiresTime = getMinDate().toISOString();
      }
      newImportant.expires_time = expiresTime;
      setImportant(newImportant);
    }
  };

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
    audience?.users?.map?.(
      (u: IAudienceUser) => !!u?.id && userIds.push(u.id || ''),
    );
    audience?.groups?.map?.(
      (u: IAudienceUser) => !!u?.id && groupIds.push(u.id || ''),
    );

    const newSettings: IPostSetting = { ...setting };
    newSettings.isImportant = sImportant?.active;
    newSettings.importantExpiredAt = sImportant?.active
      ? sImportant?.expires_time
      : null;

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
      msgSuccess: 'post:text_update_post_setting_success',
      msgError: 'post:text_update_post_setting_failed',
      onRetry: () => dispatch(postActions.putEditPost(payload)),
    };
    dispatch(postActions.putEditPost(payload));
    rootNavigation.goBack();
    return 'dispatchPutEditPost';
  };

  const handlePressSave = () => {
    if (putUpdateSettings) {
      handlePutUpdateSettings();
      return 'putUpdateSettings';
    }

    const dataDefault = [
      sImportant.active === currentSettings?.important?.active
        || sImportant.expires_time === currentSettings?.important?.expires_time,
    ];
    const newCount = dataDefault.filter((i) => !i);
    dispatch(
      postActions.setCreatePostSettings({
        important: sImportant,
        count: newCount?.length || 0,
      }),
    );
    rootNavigation.goBack();
    return 'setCreatePostSettings';
  };

  const getMinDate = () => {
    const currentDate = new Date();
    const minDate = currentDate.setHours(
      currentDate.getHours() + 1,
      currentDate.getMinutes(),
      0,
      0,
    );
    return new Date(minDate);
  };

  const getMaxDate = () => {
    const now = new Date();
    const max = now.setDate(now.getDate() + MAX_DAYS);
    return new Date(max);
  };

  return {
    sImportant,
    selectingDate,
    selectingTime,
    disableButtonSave,
    showWarning,
    handlePressSave,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    handlePutUpdateSettings,
    setSelectingDate,
    setSelectingTime,
    getMinDate,
    getMaxDate,
  };
};
