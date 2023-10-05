import React from 'react';
import streamApi from '~/api/StreamApi';
import { renderHook, renderWithRedux, waitFor } from '~/test/testUtils';
import useSearchStore from '../../store';
import SearchResult from './SearchResult';
import { mockResponseSearch } from '~/test/mock_data/search';

describe('SearchResult', () => {
  it('should show empty', async () => {
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    jest.spyOn(streamApi, 'postNewRecentSearchKeyword').mockImplementation(() => Promise.resolve());
    const spyApiSearchContent = jest.spyOn(streamApi, 'searchContent').mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      searchText: 'test',
      loadingResult: false,
      hasNextPage: true,
      endCursor: null,
      searchResults: [],
      totalResults: 0,
    });

    const wrapper = renderWithRedux(<SearchResult searchScreenKey="123" />);

    expect(spyApiSearchContent).toBeCalled();

    await waitFor(() => {
      const emptyView = wrapper.getByTestId('search_result.empty');
      expect(emptyView).toBeDefined();
    });
  });

  it('should load success', async () => {
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    jest.spyOn(streamApi, 'postNewRecentSearchKeyword').mockImplementation(() => Promise.resolve());
    const spyApiSearchContent = jest.spyOn(streamApi, 'searchContent').mockImplementation(() => Promise.resolve(mockResponseSearch));

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      searchText: 'test',
      loadingResult: false,
      hasNextPage: true,
      endCursor: null,
      searchResults: [],
      totalResults: 0,
    });

    renderWithRedux(<SearchResult searchScreenKey="123" />);

    expect(spyApiSearchContent).toBeCalled();

    await waitFor(() => {
      expect(result.current.search['123'].searchResults.length).toBe(mockResponseSearch.list.length);
    });
  });
});
