import { act, renderHook } from '@testing-library/react-hooks';
import groupApi from '~/api/GroupApi';
import useDiscoverCommunitiesStore from './store';
import { responseDiscoverCommunity } from './store/__mocks__/data';

describe('DiscoverCommunities Screen', () => {
  it('given no params, should call api getDiscoverCommunities with the next page', async () => {
    const spy = jest.spyOn(groupApi, 'getDiscoverCommunities').mockImplementation(
      () => Promise.resolve(responseDiscoverCommunity) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useDiscoverCommunitiesStore());
    act(() => {
      result.current.actions.getDiscoverCommunities();
    });
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.ids.length).toBe(responseDiscoverCommunity.data.length);
  });

  it('given param isRefreshing, should refresh data', async () => {
    const fakeIds = responseDiscoverCommunity.data.map((item) => item.id);
    const spy = jest.spyOn(groupApi, 'getDiscoverCommunities').mockImplementation(
      () => Promise.resolve(responseDiscoverCommunity) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useDiscoverCommunitiesStore());
    act(() => {
      useDiscoverCommunitiesStore.setState({
        ids: [...fakeIds, ...fakeIds],
      }, false);
    });
    act(() => {
      result.current.actions.getDiscoverCommunities(true);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.refreshing).toBe(true);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.ids.length).toBe(fakeIds.length);
  });
});
