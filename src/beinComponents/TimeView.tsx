import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import moment from 'moment';
import {AppContext} from '~/contexts/AppContext';

const intervalTime = 1000 * 60 * 5;

export interface TimeViewProps {
  style?: StyleProp<ViewStyle>;
  time: any;
  type?: 'full' | 'short';
}

const TimeView: FC<TimeViewProps> = ({
  style,
  time,
  type = 'full',
}: TimeViewProps) => {
  const [displayTime, setDisplayTime] = useState('');

  const {language} = useContext(AppContext);
  const theme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const {colors} = theme;

  useEffect(() => {
    getDisplayTime();
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      getDisplayTime();
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  const getDisplayTime = useCallback(() => {
    let result = '';
    if (!time) {
      return;
    }
    if (type === 'full') {
      result = formatFullTime(time, t, language);
    } else {
      result = formatShortTime(time, t, language);
    }
    setDisplayTime(result);
  }, []);

  return (
    <Text.BodyS color={colors.textSecondary} style={style}>
      {displayTime}
    </Text.BodyS>
  );
};

export const formatShortTime = (time: any, t: any, lang: any) => {
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
  let result = '';
  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(time, formats, true);
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

export default TimeView;
