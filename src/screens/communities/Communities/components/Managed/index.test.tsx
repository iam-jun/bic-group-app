import { act, renderHook } from '@testing-library/react-hooks';
import groupApi from '~/api/GroupApi';
import { useManagedStore } from './store';
import { responseManage, responseOwnCommunity } from './store/__mocks__/data';

describe('Managed Screen', () => {
  it('should refresh data when call doGetOwnerCommunity', async () => {
    const spy = jest.spyOn(groupApi, 'getOwnerCommunity').mockImplementation(
      () => Promise.resolve(responseOwnCommunity) as any,
    );
    const { result, waitForNextUpdate } = renderHook(() => useManagedStore());

    act(() => {
      result.current.actions.getOwnerCommunity();
    });
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.owner.hasNextPage).toBe(false);
    expect(result.current.owner.ids.length).toBe(responseOwnCommunity.data.length);
  });

  it('given no param, should load more data doGetManagedCommunityAndGroup', async () => {
    const spy = jest.spyOn(groupApi, 'getManagedCommunityAndGroup').mockImplementation(
      () => Promise.resolve(responseManage) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useManagedStore());

    act(() => {
      result.current.actions.getManagedCommunityAndGroup();
    });
    expect(result.current.manage.loading).toBe(true);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.manage.hasNextPage).toBe(false);
    expect(result.current.manage.loading).toBe(false);
    expect(result.current.manage.ids.length).toBe(responseManage.data.length);
  });

  it('given param isRefreshing, should refresh data doGetManagedCommunityAndGroup', async () => {
    const fakeIds = responseManage.data.map((item) => item.id);
    const spy = jest.spyOn(groupApi, 'getManagedCommunityAndGroup').mockImplementation(
      () => Promise.resolve(responseManage) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useManagedStore());
    act(() => {
      useManagedStore.setState({
        owner: {
          hasNextPage: true,
          ids: [...fakeIds, ...fakeIds],
        } as any,
      }, false);
    });
    act(() => {
      result.current.actions.getManagedCommunityAndGroup(true);
    });
    expect(result.current.manage.loading).toBe(false);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.manage.hasNextPage).toBe(false);
    expect(result.current.manage.loading).toBe(false);
    expect(result.current.manage.ids.length).toBe(fakeIds.length);
  });
});
