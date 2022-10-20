import { useEffect, useState } from 'react';
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
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import postKeySelector from '~/storeRedux/post/keySelector';
import postActions from '~/storeRedux/post/actions';
import { useRootNavigation } from '~/hooks/navigation';
import { checkExpiration } from '../helper/postUtils';
import { timeSuggest } from '~/constants/importantTimeSuggest';

const MAX_DAYS = 7;
const EXPIRES_ON_ENUM = { NEVER: -1, CUSTOM: 0 };

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
    initPostData = usePostsStore(postsSelector.getPost(postId));
  }

  const {
    important, currentSettings, canReact, canComment,
  } = useKeySelector(postKeySelector.createPost.all);

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
    if (!!listAudiencesWithoutPermission?.length && listAudiencesWithoutPermission.length > 0) {
      const newImportant = { ...sImportant };
      newImportant.active = !sImportant.active;
      setImportant(newImportant);
      setTimeout(() => {
        const _newImportant = { ...newImportant };
        _newImportant.active = !newImportant.active;
        setImportant(_newImportant);
        setShowWarning(true);
      }, 500);
    } else {
      const newImportant = { ...sImportant, chosenSuggestedTime: timeSuggest[0].title };
      newImportant.active = !sImportant.active;
      if (!newImportant.expiresTime) {
        newImportant.expiresTime = getMinDate(true).toISOString();
      }
      if (newImportant.active && newImportant.expiresTime) {
        const date = new Date(newImportant.expiresTime);
        if (date.getTime() < getMinDate().getTime()) {
          newImportant.expiresTime = getMinDate(true).toISOString();
        }
      }
      if (!newImportant.active) {
        newImportant.expiresTime = currentSettings?.important?.expiresTime;
      }
      setImportant(newImportant);
    }
  };

  const handleToggleCanComment = () => {
    setCanComment(!sCanComment);
  };

  const handleToggleCanReact = () => {
    setCanReact(!sCanReact);
  };

  const handleChangeDatePicker = (date?: Date) => {
    if (date) {
      const newImportant = { ...sImportant };
      let expiresTime = '';
      if (date) {
        const time = sImportant.expiresTime
          ? new Date(sImportant.expiresTime)
          : new Date();
        date.setHours(
          time.getHours(), time.getMinutes(), 0, 0,
        );
        expiresTime = date.toISOString();
        if (date.getTime() < getMinDate().getTime()) {
          expiresTime = getMinDate().toISOString();
        }
      }
      newImportant.expiresTime = expiresTime;
      setImportant(newImportant);
    }
  };

  const handleChangeTimePicker = (time?: Date) => {
    if (time) {
      const newImportant = { ...sImportant };
      const date = sImportant.expiresTime
        ? new Date(sImportant.expiresTime)
        : new Date();

      date.setHours(
        time.getHours(), time.getMinutes(), 0, 0,
      );
      let expiresTime = date.toISOString();

      if (date.getTime() < getMinDate().getTime()) {
        expiresTime = getMinDate().toISOString();
      }
      newImportant.expiresTime = expiresTime;
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
      msgSuccess: 'post:text_update_post_setting_success',
      msgError: 'post:text_update_post_setting_failed',
      onRetry: () => dispatch(postActions.putEditPost(payload)),
    };
    dispatch(postActions.putEditPost(payload));
    rootNavigation.goBack();
    return 'dispatchPutEditPost';
  };

  const handleChangeSuggestDate = (chooseDate: any) => {
    const { title, expiresOn } = chooseDate || {};
    const newImportant = { ...sImportant, chosenSuggestedTime: title };
    switch (expiresOn) {
      case EXPIRES_ON_ENUM.NEVER:
        newImportant.neverExpires = true;
        newImportant.expiresTime = null;
        setCustomExpire(false);
        break;
      case EXPIRES_ON_ENUM.CUSTOM:
        setCustomExpire(true);
        newImportant.neverExpires = false;
        newImportant.expiresTime = getMinDate().toISOString();
        break;
      default:
        setCustomExpire(false);
        newImportant.neverExpires = false;
        newImportant.expiresTime = getMinDate(true, expiresOn).toISOString();
        break;
    }
    setImportant(newImportant);
  };

  const handlePressSave = () => {
    if (putUpdateSettings) {
      handlePutUpdateSettings();
      return 'putUpdateSettings';
    }
    const isExpired = checkExpiration(sImportant?.expiresTime) || sImportant.neverExpires;

    const dataDefault = [
      !isExpired,
      !sCanComment,
      !sCanReact,
    ];

    const newCount = dataDefault.filter((i) => !!i);
    dispatch(postActions.setCreatePostSettings({
      important: sImportant,
      canComment: sCanComment,
      canReact: sCanReact,
      count: newCount?.length || 0,
    }));
    rootNavigation.goBack();
    return 'setCreatePostSettings';
  };

  const getMinDate = (isCustom?: boolean, expiresOnDay?: number) => {
    const currentDate = new Date();
    if (isCustom) {
      const defaultDate = currentDate.setDate(currentDate.getDate() + (expiresOnDay || 1));
      return new Date(defaultDate);
    }
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
