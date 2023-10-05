import React from 'react';
import streamApi from '~/api/StreamApi';
import {
  fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import useSearchStore from '../../store';
import SearchSuggestion from './SearchSuggestion';

describe('SearchSuggestion', () => {
  it('searchText.length === 0 should show recent search keyword', async () => {
    const spyApiGetRecentSearchKeywords = jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockImplementation(() => Promise.reject());

    const wrapper = renderWithRedux(<SearchSuggestion searchScreenKey="" />);

    expect(spyApiGetRecentSearchKeywords).toBeCalled();

    await waitFor(() => {
      const textNoResult = wrapper.getByTestId(
        'recent_search_keyword.no_result',
      );
      expect(textNoResult).toBeDefined();
    });
  });

  it('searchText.length > 0 should show search text and pressable', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      searchText: 'test',
    });

    const wrapper = renderWithRedux(<SearchSuggestion searchScreenKey="123" />);

    let btnTextSearch;

    await waitFor(() => {
      btnTextSearch = wrapper.getByTestId(
        'search_suggestion.btn_text_search',
      );
      expect(btnTextSearch).toBeDefined();
    });

    fireEvent.press(btnTextSearch);

    await waitFor(() => {
      expect(result.current.search['123'].isSuggestion).toBe(false);
    });
  });
});
