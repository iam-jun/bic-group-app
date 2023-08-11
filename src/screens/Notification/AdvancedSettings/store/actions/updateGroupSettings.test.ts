import { act, renderHook } from '~/test/testUtils';
import useAdvancedNotiSettingsStore from '../index';
import notificationApi from '~/api/NotificationApi';
import { IGroupNotificationSetting } from '~/interfaces/INotification';

describe('update group notification setting', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const response = { code: 'api.ok', data: true, meta: { message: 'OK' } };
  const payload: any = { flag: true };
  const dataUpdateStore: IGroupNotificationSetting = {
    communityId: '4343060d-93c9-4039-90c1-afc0e7e479ea',
    id: 'f43f2509-3b51-4b00-8d79-82b577ea49f0',
    name: 'group',
    setting: {
      name: 'group',
      enable: true,
      channels: {
        inApp: true,
        push: true,
      },
      flag: {
        value: payload.flag,
        label: 'Default',
      },
    },
  };

  it('should update group config success', () => {
    const response = { code: 'api.ok', data: true, meta: { message: 'OK' } };

    const expectData = { [dataUpdateStore.id]: { ...dataUpdateStore } };

    const spyApi = jest.spyOn(notificationApi, 'updateGroupSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.updateGroupSettings(payload, dataUpdateStore);
    });
    expect(result.current.isUpdatingGroupSettings).toBeTruthy();
    expect(result.current.isResetOrEnableGroupSettings).toBeFalsy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isUpdatingGroupSettings).toBeFalsy();
    expect(result.current.isResetOrEnableGroupSettings).toBeFalsy();
    expect(result.current.groupData).toEqual(expectData);
  });

  it('should update group config success with full param', () => {
    const expectData = { [dataUpdateStore.id]: { ...dataUpdateStore } };

    const spyApi = jest.spyOn(notificationApi, 'updateGroupSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.updateGroupSettings(payload, dataUpdateStore, true);
    });
    expect(result.current.isUpdatingGroupSettings).toBeTruthy();
    expect(result.current.isResetOrEnableGroupSettings).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isUpdatingGroupSettings).toBeFalsy();
    expect(result.current.isResetOrEnableGroupSettings).toBeFalsy();
    expect(result.current.groupData).toEqual(expectData);
  });

  it('should update group setting throw error', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'updateGroupSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.updateGroupSettings(payload, dataUpdateStore, true);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isUpdatingGroupSettings).toBeFalsy();
    expect(result.current.isResetOrEnableGroupSettings).toBeFalsy();
    expect(result.current.groupData).toEqual({});
  });
});
