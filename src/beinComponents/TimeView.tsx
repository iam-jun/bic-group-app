import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import i18next from 'i18next';

import moment from 'moment';
import 'moment/locale/vi';

import Text from '~/beinComponents/Text';
import {AppContext} from '~/contexts/AppContext';

const intervalTime = 1000 * 60; //1 min
const limitInterval = 1000 * 60 * 60; //60 mins

export interface TimeViewProps {
  testID?: string;
  style?: StyleProp<TextStyle>;
  textProps?: any;
  time: any;
  type?: 'fullDateTime' | 'dateTime' | 'short';
}

const TimeView: FC<TimeViewProps> = ({
  testID,
  style,
  textProps,
  time,
  type = 'fullDateTime',
}: TimeViewProps) => {
  const [displayTime, setDisplayTime] = useState('');

  const {language} = useContext(AppContext);
  const theme = useTheme() as ExtendedTheme;
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
      result = formatFullTime(time, language);
    } else if (type === 'dateTime') {
      result = formatDateTime(time, language);
    } else {
      result = formatShortTime(time, language);
    }
    setDisplayTime(result);
  }, [time, language]);

  return (
    <Text.BodyS
      testID={testID || 'time_view'}
      color={colors.gray50}
      style={style}
      {...textProps}>
      {displayTime}
    </Text.BodyS>
  );
};

export const formatShortTime = (time: any, lang: any) => {
  moment.locale(lang);
  let result = '';
  const date = moment.utc(time).unix();
  const now = moment().unix();
  const deltaSecond = Math.max(now - date, date - now);
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
    const d = moment(time, formats, true);
    result = d.format(lang === 'vi' ? 'DD/MM/YYYY' : 'MMM DD, YYYY');
  }
  return result;
};

export const formatFullTime = (time: any, lang: any) => {
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
      ? `MMM DD [${i18next.t('common:time:at')}] hh:mm A`
      : 'MMM DD, yyyy';
  }

  result = date.calendar(null, {
    lastDay: `[${i18next.t('common:time:yesterday')} ${i18next.t(
      'common:time:at',
    )}] hh:mm A`,
    sameDay: `[${i18next.t('common:time:today')} ${i18next.t(
      'common:time:at',
    )}] hh:mm A`,
    lastWeek: formatPreviousDay,
    sameElse: formatPreviousDay,
  });
  return result;
};

export const formatDateTime = (time: any, lang: any) => {
  moment.locale(lang);
  let result = '';
  const dateUtc = moment.utc(time);
  const localDate = dateUtc.local();
  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(localDate, formats, true);

  const formatPreviousDay = lang === 'vi' ? 'DD/MM/yyyy' : 'MMM DD, yyyy';

  result = date.calendar(null, {
    lastDay: `[${i18next.t('common:time:yesterday')}]`,
    sameDay: `[${i18next.t('common:time:today')}]`,
    lastWeek: formatPreviousDay,
    sameElse: formatPreviousDay,
  });
  return result;
};

export default TimeView;
