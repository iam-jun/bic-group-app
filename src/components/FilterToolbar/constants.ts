import { PostType } from '~/interfaces/IPost';

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
    text: 'home:newsfeed_search:today',
  },
  {
    key: TypeFilter.Yesterday,
    text: 'home:newsfeed_search:yesterday',
  },
  {
    key: TypeFilter.LastSevenDays,
    text: 'home:newsfeed_search:last_seven_days',
  },
  {
    key: TypeFilter.FromTo,
    text: 'home:newsfeed_search:specific_day',
  },
];

export const postTypeFilter = [
  {
    key: PostType.POST,
    text: 'home:newsfeed_search:filter_post',
  },
  {
    key: PostType.ARTICLE,
    text: 'home:newsfeed_search:filter_article',
  },
  {
    key: PostType.SERIES,
    text: 'home:newsfeed_search:filter_series',
  },
];
