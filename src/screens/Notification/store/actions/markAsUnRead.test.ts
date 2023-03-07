import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import notificationApi from '~/api/NotificationApi';

describe('markAsUnRead function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  const mockNotifications = { 1: { id: '1', isRead: true }, 2: { id: '2', isRead: true } };

  it('should do nothing when id is empty', () => {
    const spy = jest.spyOn(notificationApi, 'markAsUnRead').mockImplementation(
      () => Promise.resolve(true) as any,
    );
    const { result } = renderHook(() => useNotificationStore((state) => state));
    act(() => {
      result.current.actions.markAsUnRead('');
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call api mark as seen all successfully', async () => {
    const response = {
      code: 200,
    };
    const spy = jest.spyOn(notificationApi, 'markAsUnRead').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useNotificationStore.setState((state) => {
      state.notificationList = mockNotifications;
      return state;
    });

    const expectNotifications = { 1: { id: '1', isRead: false }, 2: { id: '2', isRead: true } };

    const { result, waitForNextUpdate } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.markAsUnRead('1');
    });
    expect(spy).toBeCalled();

    await waitForNextUpdate();

    expect(result.current.notificationList).toEqual(expectNotifications);
  });

  it('should call api mark as seen all throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'markAsUnRead').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useNotificationStore.setState((state) => {
      state.notificationList = mockNotifications;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      try {
        result.current.actions.markAsUnRead('1');
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.notificationList).toEqual(mockNotifications);
  });
});
