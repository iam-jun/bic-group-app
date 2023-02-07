import streamApi from '~/api/StreamApi';
import { responseSearchPost } from '~/test/mock_data/home';
import { renderHook, act } from '~/test/testUtils';
import useFeedSearchStore from '../index';

describe('getSearchPosts', () => {
  it('should getSearchPosts', () => {
    const spyApiGetSearchPost = jest.spyOn(streamApi, 'getSearchPost').mockImplementation(
      () => Promise.resolve(responseSearchPost) as any,
    );

    const { result } = renderHook(() => useFeedSearchStore((state) => state));

    jest.useFakeTimers();

    act(() => {
      result.current.actions.getSearchPosts({ searchText: 'abc' });
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetSearchPost).toBeCalled();
    expect(result.current.newsfeedSearch.hasNextPage).toEqual(false);
    expect(result.current.newsfeedSearch.loadingResult).toEqual(false);
    expect(result.current.newsfeedSearch.searchResults.length).toEqual(responseSearchPost.list.length);
  });
});
