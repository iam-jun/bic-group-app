import React from 'react';
import { renderWithRedux, configureStore } from '../../../test/testUtils';
import initialState from '../../../storeRedux/initialState';
import SearchSuggestion from './SearchSuggestion';

describe('SearchSuggestion component', () => {
  const mockStore = configureStore([]);

  it('should render button search keyword', () => {
    const onSelectKeyword = jest.fn();
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.isShow = true;
    storeData.home.newsfeedSearch.isSuggestion = true;
    storeData.home.newsfeedSearch.searchText = 'hello';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <SearchSuggestion onSelectKeyword={onSelectKeyword} />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render SearchResult', () => {
    const onSelectKeyword = jest.fn();
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.isShow = true;
    storeData.home.newsfeedSearch.isSuggestion = true;
    storeData.home.newsfeedSearch.searchText = '';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <SearchSuggestion onSelectKeyword={onSelectKeyword} />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
