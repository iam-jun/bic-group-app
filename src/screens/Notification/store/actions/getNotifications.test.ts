import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import { IParamGetNotifications } from '~/interfaces/INotification';
import notificationApi from '~/api/NotificationApi';

const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('getNotifications function', () => {
  it('get notification successfully', () => {
    const response = {
      code: 200,
      results: mockData,
      unseen: 1,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const params:IParamGetNotifications = {
      flag: 'ALL',
      keyValue: 'tabAll',
    };

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.tabAll.loading).toBeFalsy();
    expect(result.current.tabAll.data.length).toBe(0);

    act(() => {
      result.current.actions.getTabData(params);
    });
    expect(result.current.tabAll.loading).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.tabAll.loading).toBeFalsy();
    expect(result.current.tabAll.data.length).toBe(mockData.length);
    expect(result.current.unseenNumber).toBe(response.unseen);
    expect(result.current.refreshing).toBeFalsy();
  });

  it('get notifications successfully with no data', () => {
    const response = {
      code: 200,
      results: [],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const params:IParamGetNotifications = {
      flag: 'ALL',
      keyValue: 'tabAll',
    };

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.tabAll.loading).toBeFalsy();
    expect(result.current.tabAll.data.length).toBe(0);

    act(() => {
      result.current.actions.getTabData(params);
    });
    expect(result.current.tabAll.loading).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.tabAll.loading).toBeFalsy();
    expect(result.current.tabAll.data.length).toBe(response.results.length);
    expect(result.current.unseenNumber).toBe(response.unseen);
    expect(result.current.refreshing).toBeFalsy();
  });

  it('should get notifications throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const params:IParamGetNotifications = {
      flag: 'ALL',
      keyValue: 'tabAll',
      isRefresh: true,
    };

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      try {
        result.current.actions.getTabData(params);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.refreshing).toBe(true);

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.refreshing).toBeFalsy();
    expect(result.current.tabAll.loading).toBeFalsy();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
