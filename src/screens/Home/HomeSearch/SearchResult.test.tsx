import React from 'react';
import { renderWithRedux, configureStore } from '../../../test/testUtils';
import initialState from '../../../storeRedux/initialState';
import SearchResult from './SearchResult';
import { POST_DETAIL_2 } from '../../../test/mock_data/post';

describe('SearchResult component', () => {
  it('should render loading search result', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.loadingResult = true;
    storeData.home.newsfeedSearch.searchResults = [];
    storeData.home.newsfeedSearch.searchText = 'hello';
    const mockStore = configureStore([]);
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<SearchResult />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render empty search result', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.loadingResult = false;
    storeData.home.newsfeedSearch.searchResults = [];
    storeData.home.newsfeedSearch.searchText = 'hello';
    const mockStore = configureStore([]);
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<SearchResult />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list search result', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.loadingResult = false;
    storeData.home.newsfeedSearch.searchResults = [
      { ...POST_DETAIL_2, highlight: '==Important== post' },
    ] as any;
    storeData.home.newsfeedSearch.searchText = 'important';
    const mockStore = configureStore([]);
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<SearchResult />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
