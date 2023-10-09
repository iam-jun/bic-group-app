import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import useSearchStore from '../index';
import streamApi from '~/api/StreamApi';

describe('deleteRecentSearchById', () => {
  it('should deleteRecentSearchById success', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    const spyApiDeleteRecentSearchById = jest.spyOn(streamApi, 'deleteRecentSearchById').mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.deleteRecentSearchById('123');

    await waitFor(() => {
      expect(spyApiDeleteRecentSearchById).toBeCalled();
      expect(spyApiGetRecentSearchKeywords).toBeCalled();
      expect(spyConsoleError).not.toBeCalled();
    });
  });

  it('should deleteRecentSearchById error', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    const spyApiDeleteRecentSearchById = jest.spyOn(streamApi, 'deleteRecentSearchById').mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.deleteRecentSearchById('123');

    await waitFor(() => {
      expect(spyApiDeleteRecentSearchById).toBeCalled();
      expect(spyApiGetRecentSearchKeywords).not.toBeCalled();
      expect(spyConsoleError).toBeCalled();
    });
  });
});
