import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import moment from 'moment';
import 'moment/locale/vi';

import Text from '~/baseComponents/Text';
import { AppContext } from '~/contexts/AppContext';
import {
  formatDateTime, formatFullTime, formatLongTime, formatShortTime,
} from './helper';

const intervalTime = 1000 * 60; // 1 min
const limitInterval = 1000 * 60 * 60; // 60 mins

export interface TimeViewProps {
  testID?: string;
  style?: StyleProp<TextStyle>;
  textProps?: any;
  time: any;
  type?: 'fullDateTime' | 'dateTime' | 'short' | 'long';
}

const TimeView: FC<TimeViewProps> = ({
  testID,
  style,
  textProps,
  time,
  type = 'fullDateTime',
}: TimeViewProps) => {
  const [displayTime, setDisplayTime] = useState('');

  const { language } = useContext(AppContext);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  useEffect(
    () => {
      getDisplayTime();

      // start interval if delta time < 60 mins and type short
      let interval: any;
      const date = moment.utc(time).unix();
      const now = moment().unix();
      const deltaSecond = Math.max(
        now - date, date - now,
      );
      if (deltaSecond < limitInterval && (type === 'short' || type === 'long')) {
        interval = setInterval(
          () => {
            getDisplayTime();
          }, intervalTime,
        );
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [time, language],
  );

  const getDisplayTime = useCallback(
    () => {
      let result = '';
      if (!time) {
        return;
      }
      if (type === 'fullDateTime') {
        result = formatFullTime(
          time, language,
        );
      } else if (type === 'dateTime') {
        result = formatDateTime(
          time, language,
        );
      } else if (type === 'long') {
        result = formatLongTime(
          time, language,
        );
      } else {
        result = formatShortTime(
          time, language,
        );
      }
      setDisplayTime(result);
    }, [time, language],
  );

  return (
    <Text.BodyS
      testID={testID || 'time_view'}
      color={colors.gray50}
      style={style}
      {...textProps}
    >
      {displayTime}
    </Text.BodyS>
  );
};

export default TimeView;
