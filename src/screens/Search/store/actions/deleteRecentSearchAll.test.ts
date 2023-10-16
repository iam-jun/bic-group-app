import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import useSearchStore from '../index';
import streamApi from '~/api/StreamApi';

describe('deleteRecentSearchAll', () => {
  it('should deleteRecentSearchAll success', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    const spyApiDeleteCleanRecentSearch = jest.spyOn(streamApi, 'deleteCleanRecentSearch').mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.deleteRecentSearchAll('post');

    await waitFor(() => {
      expect(spyApiDeleteCleanRecentSearch).toBeCalled();
      expect(spyApiGetRecentSearchKeywords).toBeCalled();
      expect(spyConsoleError).not.toBeCalled();
    });
  });

  it('should deleteRecentSearchAll error', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    const spyApiDeleteCleanRecentSearch = jest.spyOn(streamApi, 'deleteCleanRecentSearch').mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.deleteRecentSearchAll('post');

    await waitFor(() => {
      expect(spyApiDeleteCleanRecentSearch).toBeCalled();
      expect(spyApiGetRecentSearchKeywords).not.toBeCalled();
      expect(spyConsoleError).toBeCalled();
    });
  });
});
