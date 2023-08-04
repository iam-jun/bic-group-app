import { act, renderHook } from '~/test/testUtils';
import useAdvancedNotiSettingsStore from '../index';
import { mockGroupInFlat } from '~/test/mock_data/advancedSettings';
import notificationApi from '~/api/NotificationApi';

describe('search joined group flat', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if hasSearchNextPage = false or isRefresh = false', () => {
    useAdvancedNotiSettingsStore.setState((state) => {
      state.hasSearchNextPage = false;
      return state;
    });

    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.resolve(true),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.searchJoinedGroupFlat({ key: '' });
    });

    expect(spyApi).not.toBeCalled();
  });

  it('should search group success', () => {
    useAdvancedNotiSettingsStore.setState((state) => {
      state.hasSearchNextPage = true;
      state.searchJoinedGroups = [{ id: '1', name: 'test' }] as any;
      state.selectedCommunity = { communityId: '1' };
      return state;
    });

    const response = mockGroupInFlat;
    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.searchJoinedGroupFlat({ key: '' });
    });
    expect(result.current.isLoadingSearchJoinedGroup).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingSearchJoinedGroup).toBeFalsy();
    expect(result.current.hasSearchNextPage).toEqual(mockGroupInFlat.meta.hasNextPage);
    expect(result.current.searchJoinedGroups.length).toEqual(mockGroupInFlat.data.groups.length + 1);
  });

  it('should search group success in refresh mode', () => {
    useAdvancedNotiSettingsStore.setState((state) => {
      state.hasSearchNextPage = false;
      state.searchJoinedGroups = [{ id: '1', name: 'test' }] as any;
      state.selectedCommunity = { id: '1' };
      return state;
    });

    const response = mockGroupInFlat;
    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.searchJoinedGroupFlat({ key: 'test' }, true);
    });
    expect(result.current.isLoadingSearchJoinedGroup).toBeTruthy();
    expect(result.current.hasSearchNextPage).toBeTruthy();

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingSearchJoinedGroup).toBeFalsy();
    expect(result.current.hasSearchNextPage).toEqual(mockGroupInFlat.meta.hasNextPage);
    expect(result.current.searchJoinedGroups.length).toEqual(mockGroupInFlat.data.groups.length);
  });

  it('should update community setting throw error', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useAdvancedNotiSettingsStore.setState((state) => {
      state.hasSearchNextPage = false;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.searchJoinedGroupFlat({ key: 'test' }, true);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingSearchJoinedGroup).toBeFalsy();
    expect(result.current.searchJoinedGroups.length).toEqual(0);
  });
});
