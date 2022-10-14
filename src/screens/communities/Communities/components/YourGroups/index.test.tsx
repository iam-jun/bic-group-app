import { act, renderHook } from '@testing-library/react-hooks';
import groupApi from '~/api/GroupApi';
import { useYourGroupsStore } from './store';
import { responseYourGroups } from './store/__mocks__/data';

describe('YourGroups Screen', () => {
  it('given no params, should call api getJoinedAllGroups with the next page', async () => {
    const spy = jest.spyOn(groupApi, 'getJoinedAllGroups').mockImplementation(
      () => Promise.resolve(responseYourGroups) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useYourGroupsStore());
    act(() => {
      result.current.actions.getYourGroups();
    });
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.ids.length).toBe(responseYourGroups.data.length);
  });

  it('given param isRefreshing, should refresh data', async () => {
    const fakeIds = responseYourGroups.data.map((item) => item.id);
    const spy = jest.spyOn(groupApi, 'getJoinedAllGroups').mockImplementation(
      () => Promise.resolve(responseYourGroups) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useYourGroupsStore());
    act(() => {
      useYourGroupsStore.setState({
        ids: [...fakeIds, ...fakeIds],
      }, false);
    });
    act(() => {
      result.current.actions.getYourGroups(true);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.refreshing).toBe(true);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.ids.length).toBe(fakeIds.length);
  });
});
