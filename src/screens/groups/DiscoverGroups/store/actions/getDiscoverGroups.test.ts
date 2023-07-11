import { act, renderHook } from '~/test/testUtils';
import useDiscoverGroupsStore from '../index';
import IDiscoverGroupsState from '../Interface';
import groupApi from '~/api/GroupApi';
import { mockDiscoverGroupsResponse } from '~/test/mock_data/discoverGroup';
import { mapItems } from '~/screens/groups/helper/mapper';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

describe('getDiscoverGroups', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
  const communityId = '656cebfe-1b91-473f-97fd-96837bf9e2a5';
  const newItems = mapItems(mockDiscoverGroupsResponse.data as any);

  it('should do nothing if isRefreshing = false and canLoadMore = false', () => {
    const spyApi = jest.spyOn(groupApi, 'getDiscoverGroups').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.canLoadMore = false;
      return state;
    });

    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));
    act(() => {
      result.current.actions.getDiscoverGroups({ communityId: 'test' });
    });
    expect(spyApi).not.toBeCalled();
  });

  it('should get discover groups success:', () => {
    const response = mockDiscoverGroupsResponse;

    const spyApi = jest.spyOn(groupApi, 'getDiscoverGroups').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));
    act(() => {
      result.current.actions.getDiscoverGroups({ communityId, isRefreshing: true });
    });

    expect(result.current.loading).toBeTruthy();
    expect(result.current.noGroupInCommuntity).toBeFalsy();

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.canLoadMore).toBeFalsy();
    expect(result.current.ids.length).toEqual(mockDiscoverGroupsResponse.data.length);
    expect(result.current.items).toEqual(newItems);
  });

  it('should load more discover groups success:', () => {
    const response = mockDiscoverGroupsResponse;

    const spyApi = jest.spyOn(groupApi, 'getDiscoverGroups').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const mockIds = [1, 2, 3];
    const mockItems = { 1: { id: '1' }, 2: { id: '2' }, 3: { id: '3' } };

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.ids = mockIds;
      state.items = mockItems;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));
    act(() => {
      result.current.actions.getDiscoverGroups({ communityId });
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.noGroupInCommuntity).toBeFalsy();

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    const expectItems = { ...mockItems, ...newItems };

    expect(result.current.loading).toBeFalsy();
    expect(result.current.canLoadMore).toBeFalsy();
    expect(result.current.ids.length).toEqual(mockDiscoverGroupsResponse.data.length + mockIds.length);
    expect(result.current.items).toEqual(expectItems);
  });

  it('should get discover groups throw error:', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(groupApi, 'getDiscoverGroups').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getDiscoverGroups({ communityId });
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
  });

  // test setGroupStatus
  it('should do nothing if groupId = null', () => {
    const mockIds = [1, 2, 3];
    const mockItems = { 1: { id: '1' }, 2: { id: '2' }, 3: { id: '3' } };

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.ids = mockIds;
      state.items = mockItems;
      return state;
    });

    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));
    act(() => {
      result.current.actions.setGroupStatus('', GroupJoinStatus.UNABLE_TO_JOIN);
    });
    expect(result.current.items).toEqual(mockItems);
  });

  it('should set group status with full payload', () => {
    const mockIds = [1, 2, 3];
    const mockItems = { 1: { id: '1' }, 2: { id: '2' }, 3: { id: '3' } };

    const expectItems = { 1: { id: '1', joinStatus: GroupJoinStatus.MEMBER }, 2: { id: '2' }, 3: { id: '3' } };

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.ids = mockIds;
      state.items = mockItems;
      return state;
    });

    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));
    act(() => {
      result.current.actions.setGroupStatus('1', GroupJoinStatus.MEMBER);
    });
    expect(result.current.items).toEqual(expectItems);
  });
});
