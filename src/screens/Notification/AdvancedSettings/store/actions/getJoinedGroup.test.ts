import { act, renderHook } from '~/test/testUtils';
import useAdvancedNotiSettingsStore from '../index';
import { mockGroupInFlat } from '~/test/mock_data/advancedSettings';
import notificationApi from '~/api/NotificationApi';

describe('get list group in flat mode', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const communityId = '55b974bf-34dd-4f99-af21-d1c79f90aa90';

  it('should do nothing if hasNextPage = false', () => {
    const response = mockGroupInFlat;

    useAdvancedNotiSettingsStore.setState((state) => {
      state.joinedGroups = [];
      state.hasNextPage = false;
      return state;
    });

    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getJoinedGroup(communityId);
    });
    expect(result.current.isLoadingJoinedGroup).toBeFalsy();
    expect(spyApi).not.toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingJoinedGroup).toBeFalsy();
    expect(result.current.joinedGroups.length).toEqual(0);
  });

  it('should get list group success', () => {
    const response = mockGroupInFlat;

    useAdvancedNotiSettingsStore.setState((state) => {
      state.joinedGroups = [];
      state.hasNextPage = true;
      return state;
    });

    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getJoinedGroup(communityId);
    });
    expect(result.current.isLoadingJoinedGroup).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingJoinedGroup).toBeFalsy();
    expect(result.current.joinedGroups.length).toEqual(mockGroupInFlat.data.groups.length);
  });

  it('should get groups config success with refresh = true', () => {
    const response = {
      code: 200,
      data: [],
      meta: {},
    };

    useAdvancedNotiSettingsStore.setState((state) => {
      state.joinedGroups = [];
      state.hasNextPage = true;
      return state;
    });

    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getJoinedGroup(communityId, true);
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingGroupSettings).toBeFalsy();
    expect(result.current.joinedGroups.length).toEqual(0);
  });

  it('should get groups throw error', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'getGroupsAndGroupsSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getJoinedGroup(communityId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingGroupSettings).toBeFalsy();
    expect(result.current.joinedGroups.length).toEqual(0);
  });
});
