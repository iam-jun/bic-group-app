import {
  SearchFilterGroup, SearchFilterMain, SearchFilterTags, SearchFilterTopics, SearchFilterUsers, SearchMain,
} from '~/screens/Search';

const searchScreens = {
  'search-main': SearchMain,
  'search-filter-main': SearchFilterMain,
  'search-filter-group': SearchFilterGroup,
  'search-filter-tags': SearchFilterTags,
  'search-filter-topics': SearchFilterTopics,
  'search-filter-users': SearchFilterUsers,
};

export default searchScreens;
