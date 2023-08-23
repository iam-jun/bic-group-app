import { act, renderHook } from '~/test/testUtils';
import useAdvancedNotiSettingsStore from '../index';
import notificationApi from '~/api/NotificationApi';
import { mockGroupResponse } from '~/test/mock_data/advancedSettings';

describe('get group config setting', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const communityId = '55b974bf-34dd-4f99-af21-d1c79f90aa90';

  const groupIds = [
    '1f8308a3-f589-4572-85b9-08a525e64dc3',
    '24f838a8-8974-41c6-8442-9149aa1eb5c0',
    '4ec6f1ce-53d0-4276-bb57-73f21851d394',
  ];

  it('should do nothing if groupIds = false', () => {
    const response = mockGroupResponse;

    useAdvancedNotiSettingsStore.setState((state) => {
      state.selectedCommunity = { id: communityId };
      return state;
    });

    const spyApi = jest.spyOn(notificationApi, 'getGroupSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getGroupSettings([]);
    });
    expect(result.current.isLoadingGroupSettings).toBeFalsy();
    expect(spyApi).not.toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingGroupSettings).toBeFalsy();
    expect(result.current.groupData).toEqual({});
  });

  it('should get groups config success', () => {
    const response = mockGroupResponse;
    const expectData = {};
    mockGroupResponse.data.forEach((item: any) => {
      expectData[item.groupId] = { ...item };
    });

    useAdvancedNotiSettingsStore.setState((state) => {
      state.selectedCommunity = { id: communityId };
      return state;
    });

    const spyApi = jest.spyOn(notificationApi, 'getGroupSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getGroupSettings(groupIds);
    });
    expect(result.current.isLoadingGroupSettings).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingGroupSettings).toBeFalsy();
    expect(result.current.groupData).toEqual(expectData);
  });

  it('should get groups config success with data = []', () => {
    const response = {
      code: 200,
      data: [],
      meta: {},
    };

    const spyApi = jest.spyOn(notificationApi, 'getGroupSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getGroupSettings(groupIds);
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingGroupSettings).toBeFalsy();
    expect(result.current.groupData).toEqual({});
  });

  it('should get groups throw error', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'getGroupSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getGroupSettings(groupIds);
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
    expect(result.current.groupData).toEqual({});
  });
});
