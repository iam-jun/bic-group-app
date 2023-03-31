import { act, renderHook } from '~/test/testUtils';
import useDiscoverCommunitiesSearchStore, { IDiscoverCommunitiesSearchState } from '../index';
import groupApi from '~/api/GroupApi';
import { mockDiscoverCommunityResponse } from '~/test/mock_data/discoverCommunity';
import useCommunitiesStore from '~/store/entities/communities';

describe('getDiscoverCommunitiesSearch', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if hasNextPage = false', () => {
    const spyApi = jest.spyOn(groupApi, 'getDiscoverCommunities').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    useDiscoverCommunitiesSearchStore.setState((state: IDiscoverCommunitiesSearchState) => {
      state.hasNextPage = false;
      return state;
    });

    const { result } = renderHook(() => useDiscoverCommunitiesSearchStore((state) => state));
    act(() => {
      result.current.actions.getDiscoverCommunitiesSearch({ key: 'search text' });
    });
    expect(spyApi).not.toBeCalled();
  });

  it('should get discover communities success:', () => {
    const response = mockDiscoverCommunityResponse;

    const spyApi = jest.spyOn(groupApi, 'getDiscoverCommunities').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const addCommunity = jest.fn();
    jest.spyOn(useCommunitiesStore, 'getState').mockImplementation(() => ({ actions: { addCommunity } } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverCommunitiesSearchStore((state) => state));
    act(() => {
      result.current.actions.getDiscoverCommunitiesSearch({ key: 'search text' });
    });

    expect(result.current.loading).toBeTruthy();

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(addCommunity).toBeCalled();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.hasNextPage).toEqual(mockDiscoverCommunityResponse.meta.hasNextPage);
    expect(result.current.ids.length).toEqual(mockDiscoverCommunityResponse.data.length);
  });

  it('should get discover communities success with wrong response:', () => {
    const response = { meta: { error: 'Error!!!!!' } };

    const spyApi = jest.spyOn(groupApi, 'getDiscoverCommunities').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const addCommunity = jest.fn();
    jest.spyOn(useCommunitiesStore, 'getState').mockImplementation(() => ({ actions: { addCommunity } } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverCommunitiesSearchStore((state) => state));
    act(() => {
      result.current.actions.getDiscoverCommunitiesSearch({ key: 'search text' });
    });

    expect(result.current.loading).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
    expect(addCommunity).not.toBeCalled();

    expect(result.current.loading).toBeFalsy();
    expect(result.current.refreshing).toBeFalsy();
  });

  it('should get discover communities throw error:', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(groupApi, 'getDiscoverCommunities').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverCommunitiesSearchStore((state) => state));

    act(() => {
      try {
        result.current.actions.getDiscoverCommunitiesSearch({ key: 'search text' });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.refreshing).toBeFalsy();
  });
});
