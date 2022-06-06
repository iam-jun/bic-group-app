import moment from 'moment';

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
