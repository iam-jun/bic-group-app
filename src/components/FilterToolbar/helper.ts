import moment from 'moment';
import i18n from 'i18next';
import { TypeFilter } from './constants';
import { formatDateWithSameDayLabel } from '~/beinComponents/TimeView/helper';
import useCommonController from '~/screens/store';
import { PostType } from '~/interfaces/IPost';

export const DEFAULT_DAYS_AGO = 7;

export const getDefaultStartDate = () => {
  const now = new Date();
  const defaultDate = now.setDate(now.getDate() - DEFAULT_DAYS_AGO);
  const startDefault = new Date(defaultDate).setHours(0, 0, 0, 0);
  return new Date(startDefault);
};

export const getDefaultEndDate = () => {
  const now = new Date();
  const endDefault = new Date(now).setHours(23, 59, 59, 59);
  return new Date(endDefault);
};

export const isValidDate = (sd: any, ed: any) => {
  const start = moment(sd);
  const end = moment(ed);
  return end > start;
};

export const isDiffBetweenTwoDates = (
  from: string,
  to: string,
  value: number,
  type: 'days' | 'months',
) => moment(to).diff(moment(from), type) === value;

export const getTimeAgo = (time: number, type: 'days' | 'months') => moment().subtract(time, type).startOf('day').toDate();

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
      return moment().startOf('day');
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
      return moment().subtract(7, 'day').startOf('day');
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

export const getTextFilterDateDisplay = (startDate: string, endDate: string) => {
  const currentFilter = getCurrentFilterByTimeRange(startDate, endDate);

  switch (currentFilter) {
    case TypeFilter.All:
      return i18n.t('home:newsfeed_search:filter_date');
    case TypeFilter.Today:
      return i18n.t('home:newsfeed_search:today');
    case TypeFilter.Yesterday:
      return i18n.t('home:newsfeed_search:yesterday');
    case TypeFilter.LastSevenDays:
      return i18n.t('home:newsfeed_search:last_seven_days');
    case TypeFilter.FromTo:
      return formatDateWithSameDayLabel(startDate, endDate, i18n.language);
  }
};

export const getTextNameUserDisplay = (user: any) => {
  if (!user) {
    return `${i18n.t('home:newsfeed_search:filter_post_by')}`;
  }
  const userProfileData = useCommonController.getState().myProfile;
  const textYou = user?.id === userProfileData.id ? ` (${i18n.t('common:text_you')})` : '';
  return `${user?.fullname}${textYou}`;
};

export const getTextFilterPostTypeDisplay = (postType?: PostType) => {
  if (!postType) {
    return `${i18n.t('home:newsfeed_search:filter_post_type')}`;
  }
  switch (postType) {
    case PostType.POST:
      return `${i18n.t('home:newsfeed_search:filter_post')}`;
    case PostType.ARTICLE:
      return `${i18n.t('home:newsfeed_search:filter_article')}`;
    case PostType.SERIES:
      return `${i18n.t('home:newsfeed_search:filter_series')}`;
  }
};
