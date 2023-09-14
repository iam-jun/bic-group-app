import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import useSearchStore from '../index';
import streamApi from '~/api/StreamApi';

describe('saveRecentSearchKeywords', () => {
  it('given keyword should save success', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');
    jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    const spyApiPostNewRecentSearchKeyword = jest.spyOn(streamApi, 'postNewRecentSearchKeyword').mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.saveRecentSearchKeywords('');

    await waitFor(() => {
      expect(spyApiPostNewRecentSearchKeyword).toBeCalled();
      expect(spyConsoleError).not.toBeCalled();
    });
  });

  it('given keyword should save error', async () => {
    const spyConsoleError = jest.spyOn(console, 'error');
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(() => Promise.resolve());
    const spyApiPostNewRecentSearchKeyword = jest.spyOn(streamApi, 'postNewRecentSearchKeyword').mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.saveRecentSearchKeywords('');

    await waitFor(() => {
      expect(spyApiPostNewRecentSearchKeyword).toBeCalled();
      expect(spyApiGetRecentSearchKeywords).not.toBeCalled();
      expect(spyConsoleError).toBeCalled();
    });
  });
});
