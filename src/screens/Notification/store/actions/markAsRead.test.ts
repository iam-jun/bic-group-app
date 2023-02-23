import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import notificationApi from '~/api/NotificationApi';

describe('markAsRead function', () => {
  it('do nothing if notificationId= "" ', () => {
    const fakeNotifications = { 1: { id: '1' }, 2: { id: '2' } };
    useNotificationStore.setState((state) => {
      state.tabAll.data = ['1', '2'];
      state.notificationList = fakeNotifications;
      return state;
    });

    const { result } = renderHook(() => useNotificationStore((state) => state));
    act(() => {
      result.current.actions.markAsRead('');
    });
    expect(result.current.notificationList).toEqual(fakeNotifications);
  });

  it('mark a notification as read successfully', async () => {
    const response = {
      code: 200,
    };
    const spy = jest.spyOn(notificationApi, 'markAsRead').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useNotificationStore.setState((state) => {
      state.tabAll.data = ['1', '2'];
      state.tabUnread.data = ['1'];
      state.notificationList = { 1: { id: '1' }, 2: { id: '2' } };
      return state;
    });

    const { result, waitForNextUpdate } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.markAsRead('1');
    });
    expect(result.current.tabUnread.data.length).toBe(1);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.unseenNumber).toBe(0);
    expect(result.current.notificationList['1'].isRead).toBeTruthy();
  });

  it('should call api mark as read and throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'markAsRead').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      try {
        result.current.actions.markAsRead('1');
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
