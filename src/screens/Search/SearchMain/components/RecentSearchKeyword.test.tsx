import React from 'react';
import streamApi from '~/api/StreamApi';
import {
  fireEvent,
  renderHook,
  renderWithRedux,
  waitFor,
} from '~/test/testUtils';
import RecentSearchKeyword from './RecentSearchKeyword';
import useSearchStore from '../../store';

describe('RecentSearchKeyword', () => {
  it('should show empty', async () => {
    const spyApiGetRecentSearchKeywords = jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockImplementation(() => Promise.reject());

    const wrapper = renderWithRedux(<RecentSearchKeyword searchScreenKey="" />);

    expect(spyApiGetRecentSearchKeywords).toBeCalled();

    await waitFor(() => {
      const textNoResult = wrapper.getByTestId(
        'recent_search_keyword.no_result',
      );
      expect(textNoResult).toBeDefined();
    });
  });

  it('should show list keywords', async () => {
    const mockRes = {
      recentSearches: [
        {
          id: '1',
          keyword: 'abc',
        },
        {
          id: '2',
          keyword: 'xyz',
        },
      ],
    };
    const spyApiGetRecentSearchKeywords = jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockImplementation(() => Promise.resolve(mockRes));

    const wrapper = renderWithRedux(<RecentSearchKeyword searchScreenKey="" />);

    expect(spyApiGetRecentSearchKeywords).toBeCalled();

    await waitFor(() => {
      const keywords = wrapper.queryAllByTestId('recent_search_keyword.item_', {
        exact: false,
      });
      expect(keywords.length).toBe(mockRes.recentSearches.length);
    });
  });

  it('should clear list keywords', async () => {
    const mockRes = {
      recentSearches: [
        {
          id: '1',
          keyword: 'abc',
        },
        {
          id: '2',
          keyword: 'xyz',
        },
      ],
    };
    const spyApiGetRecentSearchKeywords = jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockReturnValueOnce(Promise.resolve(mockRes))
      .mockReturnValueOnce(Promise.resolve({ recentSearches: [] }));
    const spyApiDeleteCleanRecentSearch = jest
      .spyOn(streamApi, 'deleteCleanRecentSearch')
      .mockImplementation(() => Promise.resolve());

    const wrapper = renderWithRedux(<RecentSearchKeyword searchScreenKey="" />);

    expect(spyApiGetRecentSearchKeywords).toBeCalled();

    await waitFor(() => {
      const keywords = wrapper.queryAllByTestId('recent_search_keyword.item_', {
        exact: false,
      });
      expect(keywords.length).toBe(mockRes.recentSearches.length);
    });

    const btnClearAllSearch = wrapper.getByTestId(
      'recent_search_keyword.btn_clear',
    );
    fireEvent.press(btnClearAllSearch);

    expect(spyApiDeleteCleanRecentSearch).toBeCalled();
    await waitFor(() => {
      const keywords = wrapper.queryAllByTestId('recent_search_keyword.item_', {
        exact: false,
      });
      expect(keywords.length).toBe(0);
    });
  });

  it('should delete keyword', async () => {
    const mockRes1 = {
      recentSearches: [
        {
          id: '1',
          keyword: 'abc',
        },
        {
          id: '2',
          keyword: 'xyz',
        },
      ],
    };
    const mockRes2 = {
      recentSearches: [
        {
          id: '2',
          keyword: 'xyz',
        },
      ],
    };
    const spyApiGetRecentSearchKeywords = jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockReturnValueOnce(Promise.resolve(mockRes1))
      .mockReturnValueOnce(Promise.resolve(mockRes2));
    const spyApiDeleteRecentSearchById = jest
      .spyOn(streamApi, 'deleteRecentSearchById')
      .mockImplementation(() => Promise.resolve());

    const wrapper = renderWithRedux(<RecentSearchKeyword searchScreenKey="" />);

    expect(spyApiGetRecentSearchKeywords).toBeCalled();

    await waitFor(() => {
      const keywords = wrapper.queryAllByTestId('recent_search_keyword.item_', {
        exact: false,
      });
      expect(keywords.length).toBe(mockRes1.recentSearches.length);
    });

    const btnDeleteKeyword1 = wrapper.getByTestId(
      'recent_search_keyword.btn_delete_item_0',
    );
    fireEvent.press(btnDeleteKeyword1);

    expect(spyApiDeleteRecentSearchById).toBeCalled();
    await waitFor(() => {
      const keywords = wrapper.queryAllByTestId('recent_search_keyword.item_', {
        exact: false,
      });
      expect(keywords.length).toBe(mockRes2.recentSearches.length);
    });
  });

  it('should dismiss suggestion when pressing on keyword', async () => {
    const mockRes = {
      recentSearches: [
        {
          id: '1',
          keyword: 'abc',
        },
        {
          id: '2',
          keyword: 'xyz',
        },
      ],
    };
    const spyApiGetRecentSearchKeywords = jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockImplementation(() => Promise.resolve(mockRes));

    const { result } = renderHook(() => useSearchStore());

    const wrapper = renderWithRedux(
      <RecentSearchKeyword searchScreenKey="123" />,
    );

    expect(spyApiGetRecentSearchKeywords).toBeCalled();

    await waitFor(() => {
      const keywords = wrapper.queryAllByTestId('recent_search_keyword.item_', {
        exact: false,
      });
      expect(keywords.length).toBe(mockRes.recentSearches.length);
    });

    const keyword1 = wrapper.getByTestId('recent_search_keyword.item_0');
    fireEvent.press(keyword1);

    await waitFor(() => {
      expect(result.current.search['123'].isSuggestion).toBe(false);
      expect(result.current.search['123'].searchText).toBe('abc');
    });
  });
});
