import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import moment from 'moment';
import 'moment/locale/vi';

import {ITheme} from '~/theme/interfaces';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {AppContext} from '~/contexts/AppContext';

const intervalTime = 1000 * 60; //1 min
const limitInterval = 1000 * 60 * 60; //60 mins

export interface TimeViewProps {
  style?: StyleProp<ViewStyle>;
  time: any;
  type?: 'fullDateTime' | 'dateTime' | 'short';
}

const TimeView: FC<TimeViewProps> = ({
  style,
  time,
  type = 'fullDateTime',
}: TimeViewProps) => {
  const [displayTime, setDisplayTime] = useState('');

  const {language} = useContext(AppContext);
  const theme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const {colors} = theme;

  useEffect(() => {
    getDisplayTime();

    //start interval if delta time < 60 mins and type short
    let interval: any;
    const date = moment.utc(time).unix();
    const now = moment().unix();
    const deltaSecond = Math.max(now - date, date - now);
    if (deltaSecond < limitInterval && type === 'short') {
      interval = setInterval(() => {
        getDisplayTime();
      }, intervalTime);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [time, language]);

  const getDisplayTime = useCallback(() => {
    let result = '';
    if (!time) {
      return;
    }
    if (type === 'fullDateTime') {
      result = formatFullTime(time, t, language);
    } else if (type === 'dateTime') {
      result = formatDateTime(time, t, language);
    } else {
      result = formatShortTime(time, t, language);
    }
    setDisplayTime(result);
  }, [time, language]);

  return (
    <Text.BodyS color={colors.textSecondary} style={style}>
      {displayTime}
    </Text.BodyS>
  );
};

export const formatShortTime = (time: any, t: any, lang: any) => {
  moment.locale(lang);
  let result = '';
  const date = moment.utc(time).unix();
  const now = moment().unix();
  const deltaSecond = Math.max(now - date, date - now);
  if (deltaSecond < 60) {
    result = t('common:time:now');
  } else if (deltaSecond < 60 * 60) {
    result = `${Math.round(deltaSecond / 60)}${lang === 'vi' ? ' ' : ''}${t(
      'common:time:short_min',
    )}`;
  } else if (deltaSecond < 60 * 60 * 24) {
    result = `${Math.round(deltaSecond / (60 * 60))}${
      lang === 'vi' ? ' ' : ''
    }${t('common:time:short_hour')}`;
  } else if (deltaSecond < 60 * 60 * 24 * 7) {
    result = `${Math.round(deltaSecond / (60 * 60 * 24))}${
      lang === 'vi' ? ' ' : ''
    }${t('common:time:short_day')}`;
  } else if (deltaSecond < 60 * 60 * 24 * 7 * 52) {
    result = `${Math.round(deltaSecond / (60 * 60 * 24 * 7))}${
      lang === 'vi' ? ' ' : ''
    }${t('common:time:short_week')}`;
  } else {
    const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
    const d = moment(time, formats, true);
    result = d.format(lang === 'vi' ? 'DD/MM/YYYY' : 'MMM DD, YYYY');
  }
  return result;
};

export const formatFullTime = (time: any, t: any, lang: any) => {
  moment.locale(lang);
  let result = '';
  const dateUtc = moment.utc(time);
  const localDate = dateUtc.local();
  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(localDate, formats, true);
  const isSameYear = date?.year?.() === moment().year();

  let formatPreviousDay = '';
  if (lang === 'vi') {
    formatPreviousDay = isSameYear ? 'DD/MM, hh:mm A' : 'DD/MM/yyyy';
  } else {
    formatPreviousDay = isSameYear
      ? `MMM DD [${t('common:time:at')}] hh:mm A`
      : 'MMM DD, yyyy';
  }

  result = date.calendar(null, {
    lastDay: `[${t('common:time:yesterday')} ${t('common:time:at')}] hh:mm A`,
    sameDay: `[${t('common:time:today')} ${t('common:time:at')}] hh:mm A`,
    lastWeek: formatPreviousDay,
    sameElse: formatPreviousDay,
  });
  return result;
};

export const formatDateTime = (time: any, t: any, lang: any) => {
  moment.locale(lang);
  let result = '';
  const dateUtc = moment.utc(time);
  const localDate = dateUtc.local();
  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(localDate, formats, true);

  const formatPreviousDay = lang === 'vi' ? 'DD/MM/yyyy' : 'MMM DD, yyyy';

  result = date.calendar(null, {
    lastDay: `[${t('common:time:yesterday')}]`,
    sameDay: `[${t('common:time:today')}]`,
    lastWeek: formatPreviousDay,
    sameElse: formatPreviousDay,
  });
  return result;
};

export default TimeView;
