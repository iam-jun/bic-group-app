import moment from 'moment';
import { TypeFilter } from './constants';

export const endOfToday = () => moment().endOf('day').toDate();

export const endOfTime = (
  timeRange: TypeFilter.Today | TypeFilter.Yesterday | TypeFilter.LastSevenDays,
) => {
  switch (timeRange) {
    case TypeFilter.Today:
      return moment().endOf('day');
    case TypeFilter.Yesterday:
      return moment().subtract(1, 'days').endOf('day');
    case TypeFilter.LastSevenDays:
      return moment().endOf('day');
    default:
      return undefined;
  }
};

export const startOfTime = (
  timeRange: TypeFilter.Today | TypeFilter.Yesterday | TypeFilter.LastSevenDays,
) => {
  switch (timeRange) {
    case TypeFilter.Today:
      return moment().startOf('day');
    case TypeFilter.Yesterday:
      return moment().subtract(1, 'days').startOf('day');
    case TypeFilter.LastSevenDays:
      return moment().subtract(6, 'day').startOf('day');
    default:
      return undefined;
  }
};

export const isToday = (startDate?: string, endDate?: string) => startOfTime(TypeFilter.Today).isSame(moment(startDate))
  && endOfTime(TypeFilter.Today).isSame(moment(endDate));

export const isYesterday = (startDate?: string, endDate?: string) => {
  const startOfYesterday = startOfTime(TypeFilter.Yesterday);
  const endOfYesterday = endOfTime(TypeFilter.Yesterday);
  return (
    startOfYesterday.isSame(moment(startDate))
    && endOfYesterday.isSame(moment(endDate))
  );
};

export const isLastSevenDays = (startDate?: string, endDate?: string) => {
  const startOfWeek = startOfTime(TypeFilter.LastSevenDays);
  const endOfWeek = endOfTime(TypeFilter.LastSevenDays);
  return (
    startOfWeek.isSame(moment(startDate)) && endOfWeek.isSame(moment(endDate))
  );
};

export const getCurrentFilterByTimeRange = (
  startDate?: string,
  endDate?: string,
) => {
  if (!startDate && !endDate) {
    return TypeFilter.All;
  }
  if (isToday(startDate, endDate)) {
    return TypeFilter.Today;
  }

  if (isYesterday(startDate, endDate)) {
    return TypeFilter.Yesterday;
  }

  if (isLastSevenDays(startDate, endDate)) {
    return TypeFilter.LastSevenDays;
  }

  return TypeFilter.FromTo;
};
