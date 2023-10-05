export enum TypeFilter {
  All = 'ALL',
  Today = 'TODAY',
  Yesterday = 'YESTERDAY',
  LastSevenDays = 'LAST_SEVEN_DAYS',
  FromTo = 'FROM_TO'
}

export const itemFilter = [
  {
    key: TypeFilter.Today,
    text: 'search:today',
  },
  {
    key: TypeFilter.Yesterday,
    text: 'search:yesterday',
  },
  {
    key: TypeFilter.LastSevenDays,
    text: 'search:last_seven_days',
  },
  {
    key: TypeFilter.FromTo,
    text: 'search:custom_date',
  },
];
