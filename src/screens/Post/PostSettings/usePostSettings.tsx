import {useEffect, useState} from 'react';
import {IActivityImportant} from '~/interfaces/IPost';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {isEqual} from 'lodash';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';
import {useRootNavigation} from '~/hooks/navigation';

const MAX_DAYS = 7;

export const usePostSettings = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {important, currentSettings} = useKeySelector(
    postKeySelector.createPost.all,
  );

  const [selectingDate, setSelectingDate] = useState<boolean>();
  const [selectingTime, setSelectingTime] = useState<boolean>();
  const [disableButtonSave, setDisableButtonSave] = useState<boolean>(true);
  const [sImportant, setImportant] = useState<IActivityImportant>({
    active: false,
    expires_time: '',
    ...important,
  });

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
    const newCount = dataCount.filter(i => !i);
    setDisableButtonSave(newCount.length === 0);
  };

  const handleToggleImportant = () => {
    const newImportant = {...sImportant};
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
  };

  const handleChangeDatePicker = (date?: Date) => {
    setSelectingDate(false);
    setSelectingTime(false);
    if (date) {
      const newImportant = {...sImportant};
      let expiresTime = '';
      if (date) {
        const time = sImportant.expires_time
          ? new Date(sImportant.expires_time)
          : new Date();
        date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
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
      const newImportant = {...sImportant};
      const date = sImportant.expires_time
        ? new Date(sImportant.expires_time)
        : new Date();

      date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
      let expiresTime = date.toISOString();

      if (date.getTime() < getMinDate().getTime()) {
        expiresTime = getMinDate().toISOString();
      }
      newImportant.expires_time = expiresTime;
      setImportant(newImportant);
    }
  };

  const handlePressSave = () => {
    const dataDefault = [
      sImportant.active === currentSettings?.important?.active ||
        sImportant.expires_time === currentSettings?.important?.expires_time,
    ];
    const newCount = dataDefault.filter(i => !i);
    dispatch(
      postActions.setCreatePostSettings({
        important: sImportant,
        count: newCount?.length || 0,
      }),
    );
    rootNavigation.goBack();
  };

  const getMinDate = () => {
    const currentDate = new Date();
    const minDate = currentDate.setHours(currentDate.getHours() + 1);
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
    handlePressSave,
    handleToggleImportant,
    handleChangeDatePicker,
    handleChangeTimePicker,
    setSelectingDate,
    setSelectingTime,
    getMinDate,
    getMaxDate,
  };
};
