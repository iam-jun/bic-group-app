import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import useSearchStore from '../index';
import streamApi from '~/api/StreamApi';

describe('getRecentSearchKeywords', () => {
  it('should get getRecentSearchKeywords success', async () => {
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
    const spyConsoleError = jest.spyOn(console, 'error');
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve(mockRes));

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.getRecentSearchKeywords({});

    await waitFor(() => {
      expect(spyApiGetRecentSearchKeywords).toBeCalled();
      expect(spyConsoleError).not.toBeCalled();
      expect(result.current.recentSearchKeyword.data.length).toBe(mockRes.recentSearches.length);
    });
  });

  it('should get getRecentSearchKeywords error', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.saveRecentSearchKeywords('');

    await waitFor(() => {
      expect(spyApiGetRecentSearchKeywords).toBeCalled();
      expect(spyConsoleError).toBeCalled();
      expect(result.current.recentSearchKeyword.data.length).toBe(0);
    });
  });
});
