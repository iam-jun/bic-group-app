import { EXPIRES_ON_TYPE, timeSuggest } from '~/constants/importantTimeSuggest';
import { IAudience } from '~/interfaces/IPost';

const MAX_DAYS = 7;
const EXPIRES_ON_ENUM = { NEVER: -1, CUSTOM: 0 };

export const getMinDateImportant = (isCustom?: boolean, expiresOnDay?: number, type?: string) => {
  const currentDate = new Date();
  if (isCustom && type) {
    let defaultDate = 0;
    switch (type) {
      case EXPIRES_ON_TYPE.DAY:
        defaultDate = currentDate.setDate(currentDate.getDate() + (expiresOnDay || 1));
        return new Date(defaultDate);
      case EXPIRES_ON_TYPE.MONTH:
        defaultDate = currentDate.setMonth(currentDate.getMonth() + 1 + (expiresOnDay || 1));
        return new Date(defaultDate);
      default:
        defaultDate = currentDate.setFullYear(currentDate.getFullYear() + (expiresOnDay || 1));
        return new Date(defaultDate);
    }
  }
  const minDate = currentDate.setHours(
    currentDate.getHours() + 1,
    currentDate.getMinutes(),
    0,
    0,
  );
  return new Date(minDate);
};

export const getMaxDateImportant = () => {
  const now = new Date();
  const max = now.setDate(now.getDate() + MAX_DAYS);
  return new Date(max);
};

export const handleChangeSuggestDateImportant = (
  chooseDate: any,
  sImportant: any,
  setImportant: any,
  setCustomExpire: any,
) => {
  const { title, expiresOn, type } = chooseDate || {};
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
      newImportant.expiresTime = getMinDateImportant().toISOString();
      break;
    default:
      setCustomExpire(false);
      newImportant.neverExpires = false;
      newImportant.expiresTime = getMinDateImportant(true, expiresOn, type).toISOString();
      break;
  }
  setImportant(newImportant);
};

export const handleChangeTimePickerImportant = (
  time?: Date,
  sImportant?: any,
  setImportant?: any,
) => {
  if (time) {
    const newImportant = { ...sImportant };
    const date = sImportant.expiresTime
      ? new Date(sImportant.expiresTime)
      : new Date();

    date.setHours(
      time.getHours(), time.getMinutes(), 0, 0,
    );
    let expiresTime = date.toISOString();

    if (date.getTime() < getMinDateImportant().getTime()) {
      expiresTime = getMinDateImportant().toISOString();
    }
    newImportant.expiresTime = expiresTime;
    setImportant(newImportant);
  }
};

export const handleChangeDatePickerImportant = (
  date: Date,
  sImportant: any,
  setImportant: any,
) => {
  if (date) {
    const newImportant = { ...sImportant };
    let expiresTime = '';
    const time = sImportant.expiresTime
      ? new Date(sImportant.expiresTime)
      : new Date();
    date.setHours(
      time.getHours(), time.getMinutes(), 0, 0,
    );
    expiresTime = date.toISOString();
    if (date.getTime() < getMinDateImportant().getTime()) {
      expiresTime = getMinDateImportant().toISOString();
    }
    newImportant.expiresTime = expiresTime;
    setImportant(newImportant);
  }
};

export const toggleImportant = (
  listAudiencesWithoutPermission: IAudience[],
  sImportant: any,
  setImportant: any,
  setShowWarning: any,
) => {
  if (listAudiencesWithoutPermission?.length > 0) {
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
      newImportant.expiresTime = getMinDateImportant(true, 1, EXPIRES_ON_TYPE.DAY).toISOString();
    }
    if (newImportant.active && newImportant.expiresTime) {
      const date = new Date(newImportant.expiresTime);
      if (date.getTime() < getMinDateImportant().getTime()) {
        newImportant.expiresTime = getMinDateImportant(true, 1, EXPIRES_ON_TYPE.DAY).toISOString();
      }
    }
    if (!newImportant.active) {
      newImportant.expiresTime = null;
    }
    setImportant(newImportant);
  }
};
