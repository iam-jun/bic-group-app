const homeKeySelector = {
  loadingHomePosts: 'home.loadingHomePosts',
  refreshingHomePosts: 'home.refreshingHomePosts',
  homePosts: 'home.homePosts',
  noMoreHomePosts: 'home.noMoreHomePosts',
  newsfeedSearchState: 'home.newsfeedSearch',
  newsfeedSearch: {
    isShow: 'home.newsfeedSearch.isShow',
    isSuggestion: 'home.newsfeedSearch.isSuggestion',
    searchText: 'home.newsfeedSearch.searchText',
    searchInputRef: 'home.newsfeedSearch.searchInputRef',
  },
  newsfeedSearchFilterCreatedBy: 'home.newsfeedSearchFilter.createdBy',
  newsfeedSearchFilterDate: 'home.newsfeedSearchFilter.date',
  newsfeedSearchUsers: 'home.newsfeedSearchUsers',
};

export default homeKeySelector;
