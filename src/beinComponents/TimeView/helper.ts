import i18next from 'i18next';
import moment from 'moment';

export const formatShortTime = (
  time: any, lang: any,
) => {
  moment.locale(lang);
  let result = '';
  const date = moment.utc(time).unix();
  const now = moment().unix();
  const deltaSecond = Math.max(
    now - date, date - now,
  );
  if (deltaSecond < 60) {
    result = i18next.t('common:time:now');
  } else if (deltaSecond < 60 * 60) {
    result = `${Math.round(deltaSecond / 60)}${
      lang === 'vi' ? ' ' : ''
    }${i18next.t('common:time:short_min')}`;
  } else if (deltaSecond < 60 * 60 * 24) {
    result = `${Math.round(deltaSecond / (60 * 60))}${
      lang === 'vi' ? ' ' : ''
    }${i18next.t('common:time:short_hour')}`;
  } else if (deltaSecond < 60 * 60 * 24 * 7) {
    result = `${Math.round(deltaSecond / (60 * 60 * 24))}${
      lang === 'vi' ? ' ' : ''
    }${i18next.t('common:time:short_day')}`;
  } else if (deltaSecond < 60 * 60 * 24 * 7 * 52) {
    result = `${Math.round(deltaSecond / (60 * 60 * 24 * 7))}${
      lang === 'vi' ? ' ' : ''
    }${i18next.t('common:time:short_week')}`;
  } else {
    const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
    const d = moment(
      time, formats, true,
    );
    result = d.format(lang === 'vi' ? 'DD/MM/YYYY' : 'MMM DD, YYYY');
  }
  return result;
};

export const formatLongTime = (
  time: any, lang: any,
) => {
  moment.locale(lang);
  let result = '';
  const date = moment.utc(time).unix();
  const now = moment().unix();
  const deltaSecond = Math.max(
    now - date, date - now,
  );
  if (deltaSecond < 60) {
    result = i18next.t('common:time:now');
  } else if (deltaSecond < 60 * 60) {
    const min = Math.round(deltaSecond / 60);
    result = `${min} ${min === 1 ? i18next.t('common:time:long_min') : i18next.t('common:time:long_mins')}`;
  } else if (deltaSecond < 60 * 60 * 24) {
    const hour = Math.round(deltaSecond / (60 * 60));
    result = `${hour} ${hour === 1 ? i18next.t('common:time:long_hour') : i18next.t('common:time:long_hours')}`;
  } else if (deltaSecond < 60 * 60 * 24 * 7) {
    const day = Math.round(deltaSecond / (60 * 60 * 24));
    result = `${day} ${day === 1 ? i18next.t('common:time:long_day') : i18next.t('common:time:long_days')}`;
  } else if (deltaSecond < 60 * 60 * 24 * 7 * 52) {
    const week = Math.round(deltaSecond / (60 * 60 * 24 * 7));
    result = `${week} ${week === 1 ? i18next.t('common:time:long_week') : i18next.t('common:time:long_weeks')}`;
  } else {
    const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
    const d = moment(
      time, formats, true,
    );
    result = d.format(lang === 'vi' ? 'DD/MM/YYYY' : 'MMM DD, YYYY');
  }
  return result;
};

export const formatFullTime = (
  time: any, lang: any,
) => {
  moment.locale(lang);
  let result = '';
  const dateUtc = moment.utc(time);
  const localDate = dateUtc.local();
  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(
    localDate, formats, true,
  );
  const isSameYear = date?.year?.() === moment().year();

  let formatPreviousDay = '';
  if (lang === 'vi') {
    formatPreviousDay = isSameYear ? 'DD/MM, hh:mm A' : 'DD/MM/yyyy';
  } else {
    formatPreviousDay = isSameYear
      ? `MMM DD [${i18next.t('common:time:at')}] hh:mm A`
      : 'MMM DD, yyyy';
  }

  result = date.calendar(
    null, {
      lastDay: `[${i18next.t('common:time:yesterday')} ${i18next.t('common:time:at')}] hh:mm A`,
      sameDay: `[${i18next.t('common:time:today')} ${i18next.t('common:time:at')}] hh:mm A`,
      lastWeek: formatPreviousDay,
      sameElse: formatPreviousDay,
    },
  );
  return result;
};

export const formatDateTime = (
  time: any, lang: any,
) => {
  moment.locale(lang);
  let result = '';
  const dateUtc = moment.utc(time);
  const localDate = dateUtc.local();
  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(
    localDate, formats, true,
  );

  const formatPreviousDay = lang === 'vi' ? 'DD/MM/yyyy' : 'MMM DD, yyyy';

  result = date.calendar(
    null, {
      lastDay: `[${i18next.t('common:time:yesterday')}]`,
      sameDay: `[${i18next.t('common:time:today')}]`,
      nextDay: formatPreviousDay,
      lastWeek: formatPreviousDay,
      sameElse: formatPreviousDay,
    },
  );
  return result;
};

export const formatDateWithSameDayLabel = (
  start: any, end: any, lang: any,
) => {
  const startDate = moment(start);
  const endDate = moment(end);

  const formatPreviousDay = lang === 'vi' ? 'DD/MM/yyyy' : 'MMM DD, yyyy';

  if (startDate.isSame(endDate, 'day')) {
    if (startDate.isSame(moment(), 'day')) {
      return `${i18next.t('common:time:today')}`;
    }

    return startDate.format(formatPreviousDay);
  }

  return `${startDate.format(formatPreviousDay)} - ${endDate.format(formatPreviousDay)}`;
};
