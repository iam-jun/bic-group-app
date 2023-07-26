import { act, renderHook } from '~/test/testUtils';
import useNotiSettingsStore from '../index';
import { mockConfigData } from '~/test/mock_data/notificationConfig';
import notificationApi from '~/api/NotificationApi';
import { INotiSettings } from '~/interfaces/INotification';

describe('get noti config setting', () => {
  it('should get notification config success if refreshing = false:', () => {
    const response = {
      code: 200,
      data: [],
      meta: {},
    };

    const spyApi = jest.spyOn(notificationApi, 'getConfigSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getConfigSettings(false);
    });
    expect(result.current.isRefreshing).toBeFalsy();
    expect(result.current.loading).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isRefreshing).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.data).toEqual({});
  });

  it('should get notification config success if refreshing = true:', () => {
    const expectData = {};
    mockConfigData.forEach((item: INotiSettings) => {
      expectData[item.name] = { ...item };
    });

    const response = {
      code: 200,
      data: mockConfigData,
      meta: {},
    };

    const spyApi = jest.spyOn(notificationApi, 'getConfigSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotiSettingsStore((state) => state));
    act(() => {
      result.current.actions.getConfigSettings(true);
    });

    expect(result.current.isRefreshing).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isRefreshing).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.data).toEqual(expectData);
  });

  it('should get series throw error and should show toast', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(notificationApi, 'getConfigSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotiSettingsStore((state) => state));

    act(() => {
      try {
        result.current.actions.getConfigSettings(true);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.isRefreshing).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isRefreshing).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.data).toEqual({});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
