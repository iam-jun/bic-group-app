import { act, renderHook } from '@testing-library/react-hooks';
import groupApi from '~/api/GroupApi';
import useYourCommunitiesStore from './store';
import { responseDiscoverCommunity } from './store/__mocks__/data';

describe('YourCommunities Screen', () => {
  it('given no params, should call api getJoinedCommunities with the next page', async () => {
    const spy = jest.spyOn(groupApi, 'getJoinedCommunities').mockImplementation(
      () => Promise.resolve(responseDiscoverCommunity) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useYourCommunitiesStore());
    act(() => {
      result.current.actions.getYourCommunities();
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
    const spy = jest.spyOn(groupApi, 'getJoinedCommunities').mockImplementation(
      () => Promise.resolve(responseDiscoverCommunity) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useYourCommunitiesStore());
    act(() => {
      useYourCommunitiesStore.setState({
        ids: [...fakeIds, ...fakeIds],
      }, false);
    });
    act(() => {
      result.current.actions.getYourCommunities(true);
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
