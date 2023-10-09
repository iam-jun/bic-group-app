import React from 'react';
import streamApi from '~/api/StreamApi';
import {
  fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import SearchMain from './index';
import { mockResponseSearch } from '~/test/mock_data/search';
import * as navigationHook from '~/hooks/navigation';
import useSearchStore from '../store';

describe('SearchMain screen', () => {
  it('should show suggestion', async () => {
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());

    const wrapper = renderWithRedux(<SearchMain route={{ key: '123', params: {} }} />);

    await waitFor(() => {
      const suggestionView = wrapper.getByTestId('search_suggestion');
      expect(suggestionView).toBeDefined();
    });
  });

  it('should show results', async () => {
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    jest.spyOn(streamApi, 'postNewRecentSearchKeyword').mockImplementation(() => Promise.resolve());
    jest.spyOn(streamApi, 'searchContent').mockImplementation(() => Promise.resolve(mockResponseSearch));

    const wrapper = renderWithRedux(<SearchMain route={{ key: '123', params: { tag: { name: 'tag1' } as any, group: { id: 'www' } as any } }} />);

    await waitFor(() => {
      const resultsView = wrapper.getByTestId('search_result');
      expect(resultsView).toBeDefined();
    });
  });

  it('should pressable on filter', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());

    const wrapper = renderWithRedux(<SearchMain route={{ key: '123', params: {} }} />);

    const btnFilter = wrapper.getByTestId('search_header.filter');

    fireEvent.press(btnFilter);

    expect(navigate).toBeCalled();
  });

  it('should update text search when typing', async () => {
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => useSearchStore());

    const wrapper = renderWithRedux(<SearchMain route={{ key: '123', params: {} }} />);

    const searchInput = wrapper.getByTestId('search_input.input');

    fireEvent.changeText(searchInput, 'test');

    await waitFor(() => {
      expect(result.current.search['123'].searchText).toBe('test');
    });
  });

  it('should isSuggestion = false when submit', async () => {
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => useSearchStore());

    const wrapper = renderWithRedux(<SearchMain route={{ key: '123', params: {} }} />);

    const searchInput = wrapper.getByTestId('search_input.input');

    fireEvent.changeText(searchInput, 'test');

    await waitFor(() => {
      expect(result.current.search['123'].searchText).toBe('test');
    });

    searchInput.props.onSubmitEditing();

    await waitFor(() => {
      expect(result.current.search['123'].isSuggestion).toBe(false);
    });
  });
});
