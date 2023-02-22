import React from 'react';
import { act, renderWithRedux } from '../../../test/testUtils';
import SearchSuggestion from './SearchSuggestion';
import streamApi from '~/api/StreamApi';
import { recentSearchKeywords } from '~/test/mock_data/home';
import useFeedSearchStore from './store';

describe('SearchSuggestion component', () => {
  it('should render SearchResult', () => {
    const onSelectKeyword = jest.fn();
    const spyApiGetRecentSearchKeywords = jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockImplementation(() => Promise.resolve(recentSearchKeywords) as any);
    jest.useFakeTimers();
    renderWithRedux(
      <SearchSuggestion onSelectKeyword={onSelectKeyword} />,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetRecentSearchKeywords).toBeCalled();
    expect(
      useFeedSearchStore.getState().newsfeedSearchRecentKeyword.data.length,
    ).toEqual(recentSearchKeywords.recentSearches.length);
  });

  it('should not render list recent search if text search is not empty', () => {
    const onSelectKeyword = jest.fn();
    act(() => {
      useFeedSearchStore.getState().actions.setNewsfeedSearch({ searchText: 'abc' });
    });

    const wrapper = renderWithRedux(
      <SearchSuggestion onSelectKeyword={onSelectKeyword} />,
    );
    const textSearch = wrapper.findByTestId('text_search');

    expect(textSearch).toBeDefined();
  });
});
