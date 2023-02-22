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
});
