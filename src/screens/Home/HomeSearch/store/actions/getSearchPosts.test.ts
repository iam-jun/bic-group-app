import streamApi from '~/api/StreamApi';
import { responseSearchPost } from '~/test/mock_data/home';
import { renderHook, act } from '~/test/testUtils';
import useFeedSearchStore from '../index';
import useModalStore from '~/store/modal';

describe('getSearchPosts', () => {
  it('should getSearchPosts', () => {
    const spyApiGetSearchPost = jest
      .spyOn(streamApi, 'getSearchPost')
      .mockImplementation(() => Promise.resolve(responseSearchPost) as any);

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

  it('should getSearchPosts throw error', () => {
    const showToast = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showToast = showToast;
      return state;
    });

    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getSearchPost').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useFeedSearchStore((state) => state));
    act(() => {
      try {
        result.current.actions.getSearchPosts({ searchText: 'abc' });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });
});
