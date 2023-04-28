import streamApi from '~/api/StreamApi';
import { recentSearchKeywords } from '~/test/mock_data/home';
import { renderHook, act } from '~/test/testUtils';
import useFeedSearchStore from '../index';

describe('getRecentSearchKeywords', () => {
  it('should getRecentSearchKeywords', () => {
    const spyApiGetRecentSearchKeywords = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(
      () => Promise.resolve(recentSearchKeywords) as any,
    );

    const { result } = renderHook(() => useFeedSearchStore((state) => state));

    jest.useFakeTimers();

    act(() => {
      result.current.actions.getRecentSearchKeywords({});
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetRecentSearchKeywords).toBeCalled();
    expect(result.current.newsfeedSearchRecentKeyword.loading).toEqual(false);
    expect(result.current.newsfeedSearchRecentKeyword.data.length).toEqual(recentSearchKeywords.recentSearches.length);
  });

  it('should getRecentSearchKeywords throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getRecentSearchKeywords').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useFeedSearchStore((state) => state));
    act(() => {
      try {
        result.current.actions.getRecentSearchKeywords({});
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(errorLog).toBeCalled();
  });
});
