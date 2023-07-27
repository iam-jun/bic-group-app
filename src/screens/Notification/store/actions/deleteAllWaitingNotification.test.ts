import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import notificationApi from '~/api/NotificationApi';

describe('delete notification is in queue function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should do nothing if waitingForDelete is empty', () => {
    useNotificationStore.setState((state) => {
      state.waitingForDelete = [];
      return state;
    });

    const spy = jest.spyOn(notificationApi, 'deleteNotification').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.waitingForDelete.length).toBe(0);

    act(() => {
      result.current.actions.deleteAllWaitingNotification();
    });
    expect(spy).not.toBeCalled();
    expect(result.current.waitingForDelete.length).toBe(0);
  });

  it('should delete all notification in waiting queue in BE success', () => {
    useNotificationStore.setState((state) => {
      state.waitingForDelete = ['2'];
      return state;
    });

    const response = {
      code: 200,
    };
    const spy = jest.spyOn(notificationApi, 'deleteNotification').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.waitingForDelete.length).toBe(1);

    act(() => {
      result.current.actions.deleteAllWaitingNotification();
    });
    expect(spy).toBeCalled();
    expect(result.current.waitingForDelete.length).toBe(0);
  });

  it('should delete notification in BE throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'deleteNotification').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useNotificationStore.setState((state) => {
      state.waitingForDelete = ['1', '2'];
      return state;
    });

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.waitingForDelete.length).toBe(2);

    act(() => {
      try {
        result.current.actions.deleteAllWaitingNotification();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });
  });
});
