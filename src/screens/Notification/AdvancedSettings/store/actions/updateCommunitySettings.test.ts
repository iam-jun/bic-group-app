import { act, renderHook } from '~/test/testUtils';
import useAdvancedNotiSettingsStore from '../index';
import notificationApi from '~/api/NotificationApi';
import { IAdvancedNotificationSettings } from '~/interfaces/INotification';

describe('update community notification setting', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const payload: any = { enable: false };
  const dataUpdateStore: IAdvancedNotificationSettings = {
    communityId: '4343060d-93c9-4039-90c1-afc0e7e479ea',
    groupId: 'f43f2509-3b51-4b00-8d79-82b577ea49f0',
    name: 'community',
    enable: true,
    id: '4343060d-93c9-4039-90c1-afc0e7e479ea',
  };

  it('should update community config success', () => {
    const response = { code: 'api.ok', data: true, meta: { message: 'OK' } };

    const expectData = { [dataUpdateStore.id]: { ...dataUpdateStore } };

    const spyApi = jest.spyOn(notificationApi, 'updateCommunitySettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.updateCommunitySettings(payload, dataUpdateStore);
    });
    expect(result.current.isUpdatingCommunitySettings).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isUpdatingCommunitySettings).toBeFalsy();
    expect(result.current.communityData).toEqual(expectData);
    expect(result.current.selectedCommunity).toEqual(dataUpdateStore);
  });

  it('should update community setting throw error', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'updateCommunitySettings').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const selectedCommunity = { id: dataUpdateStore.id };
    useAdvancedNotiSettingsStore.setState((state) => {
      state.selectedCommunity = selectedCommunity;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useAdvancedNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.updateCommunitySettings(payload, dataUpdateStore);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isUpdatingCommunitySettings).toBeFalsy();
    expect(result.current.selectedCommunity).toEqual(selectedCommunity);
    expect(result.current.communityData).toEqual({});
  });
});
