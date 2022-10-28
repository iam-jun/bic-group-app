import i18next from 'i18next';

export const EXPIRES_ON_TYPE = {
  DAY: 'DAY',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
};

export const timeSuggest = [
  {
    id: 1,
    title: i18next.t('common:text_day', { number: 1 }),
    expiresOn: 1,
    type: EXPIRES_ON_TYPE.DAY,
  },
  {
    id: 2,
    title: i18next.t('common:text_days', { number: 3 }),
    expiresOn: 3,
    type: EXPIRES_ON_TYPE.DAY,
  }, {
    id: 3,
    title: i18next.t('common:text_week', { number: 1 }),
    expiresOn: 7,
    type: EXPIRES_ON_TYPE.DAY,
  },
  {
    id: 4,
    title: i18next.t('common:text_weeks', { number: 2 }),
    expiresOn: 14,
    type: EXPIRES_ON_TYPE.DAY,
  },
  {
    id: 5,
    title: i18next.t('common:text_month', { number: 1 }),
    expiresOn: 1,
    type: EXPIRES_ON_TYPE.MONTH,
  },
  {
    id: 6,
    title: i18next.t('common:text_months', { number: 3 }),
    expiresOn: 3,
    type: EXPIRES_ON_TYPE.MONTH,
  },
  {
    id: 7,
    title: i18next.t('common:text_months', { number: 6 }),
    expiresOn: 6,
    type: EXPIRES_ON_TYPE.MONTH,
  },
  {
    id: 8,
    title: i18next.t('common:text_year', { number: 1 }),
    expiresOn: 1,
    type: EXPIRES_ON_TYPE.YEAR,
  },
  {
    id: 9,
    title: i18next.t('common:text_never'),
    expiresOn: -1,
  },
  {
    id: 10,
    title: i18next.t('common:text_custom'),
    expiresOn: 0,
  },
];
