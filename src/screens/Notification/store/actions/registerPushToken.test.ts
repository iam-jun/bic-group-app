import useNotificationStore from '../index';
import { act, renderHook } from '~/test/testUtils';
import { notificationApiConfig } from '~/api/NotificationApi';

describe('registerPushToken', () => {
  it('should register push token successfully', () => {
    const response = {
      code: 200,
      provider: {
        name: 'BeinNotification',
      },
    };

    const spyPushToken = jest.spyOn(notificationApiConfig, 'pushToken').mockImplementation(
      () => response as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.registerPushToken();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.pushToken).toEqual('myMockToken');
    expect(spyPushToken).toHaveBeenCalled();
  });

  it('should register push token throw error', () => {
    const response = {
      code: 500,
    };

    const spyPushToken = jest.spyOn(notificationApiConfig, 'pushToken').mockImplementation(
      () => response as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.registerPushToken('test');
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyPushToken).toHaveBeenCalled();
    expect(result.current.pushToken).toEqual('');
  });
});
