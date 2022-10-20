import i18next from 'i18next';

export const timeSuggest = [
  {
    id: 1,
    title: i18next.t('common:text_day', { number: 1 }),
    expiresOn: 1,
  },
  {
    id: 2,
    title: i18next.t('common:text_days', { number: 3 }),
    expiresOn: 3,
  }, {
    id: 3,
    title: i18next.t('common:text_week', { number: 1 }),
    expiresOn: 7,
  },
  {
    id: 4,
    title: i18next.t('common:text_weeks', { number: 2 }),
    expiresOn: 14,
  },
  {
    id: 5,
    title: i18next.t('common:text_month', { number: 1 }),
    expiresOn: 30,
  },
  {
    id: 6,
    title: i18next.t('common:text_months', { number: 3 }),
    expiresOn: 90,
  }, {
    id: 7,
    title: i18next.t('common:text_year', { number: 1 }),
    expiresOn: 365,
  },
  {
    id: 8,
    title: i18next.t('common:text_never'),
    expiresOn: -1,
  },
  {
    id: 9,
    title: i18next.t('common:text_custom'),
    expiresOn: 0,
  },
];
