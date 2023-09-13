import { act, renderHook } from '~/test/testUtils';
import notificationApi from '~/api/NotificationApi';
import useNotificationItemMenu from '../index';

describe('getSeperateNotificationSettings function', () => {
  const targetId = '123';
  it('should get settings successfully', () => {
    const response = {
      code: 200,
      data: {
        enable: true,
      },
    };
    const spy = jest.spyOn(notificationApi, 'getSpecificNotificationSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationItemMenu((state) => state));
    expect(result.current.loading).toBeTruthy();
    expect(result.current.enableNotificationSettings).toBeTruthy();

    act(() => {
      result.current.actions.getSeperateNotificationSettings(targetId);
    });
    expect(result.current.loading).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.enableNotificationSettings).toEqual(response.data.enable);
  });

  it('should get settings successfully if data is undefined', () => {
    const response = {
      code: 200,
      data: {
        enable: undefined,
      },
    };
    const spy = jest.spyOn(notificationApi, 'getSpecificNotificationSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationItemMenu((state) => state));
    expect(result.current.loading).toBeTruthy();
    expect(result.current.enableNotificationSettings).toBeTruthy();

    act(() => {
      result.current.actions.getSeperateNotificationSettings(targetId);
    });
    expect(result.current.loading).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.enableNotificationSettings).toBeFalsy();
  });

  it('should get settings throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'getSpecificNotificationSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationItemMenu((state) => state));
    expect(result.current.loading).toBeTruthy();
    expect(result.current.enableNotificationSettings).toBeTruthy();

    act(() => {
      try {
        result.current.actions.getSeperateNotificationSettings(targetId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBeTruthy();

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.enableNotificationSettings).toBeTruthy();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
