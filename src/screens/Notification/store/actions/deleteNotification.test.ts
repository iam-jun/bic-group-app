import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import notificationApi from '~/api/NotificationApi';

describe('delete notification function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should do nothing if notificationId is empty', () => {
    const notificationId = '';
    const mockNoti = {
      id: '2',
      notificationFlag: 'NOMARL',
      extra: {
        type: 'comment.to_mentioned_user.in_comment',
        actors: [
          {
            id: '623',
            avatar: '',
            fullname: 'Linh Linh',
            username: 'ngoclinh',
          },
        ],
        description: '**Linh Linh** posted in **3** groups',
        content: 'ửyseryesr',
      },
      updated_at: '2023-02-16T02:50:28.238Z',
    };

    useNotificationStore.setState((state) => {
      state.notificationList = { 2: mockNoti };
      state.waitingForDelete = [];
      return state;
    });

    const spy = jest.spyOn(notificationApi, 'deleteNotification').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.waitingForDelete.length).toBe(0);

    act(() => {
      result.current.actions.deleteNotification(notificationId);
    });
    expect(spy).not.toBeCalled();
    expect(result.current.waitingForDelete.length).toBe(0);
    expect(result.current.notificationList).toEqual({ 2: mockNoti });
  });

  it('should delete notification in BE success', () => {
    const notificationId = '2';
    const mockNoti = {
      id: '2',
      notificationFlag: 'NOMARL',
      extra: {
        type: 'comment.to_mentioned_user.in_comment',
        actors: [
          {
            id: '623',
            avatar: '',
            fullname: 'Linh Linh',
            username: 'ngoclinh',
          },
        ],
        description: '**Linh Linh** posted in **3** groups',
        content: 'ửyseryesr',
      },
      updated_at: '2023-02-16T02:50:28.238Z',
    };

    useNotificationStore.setState((state) => {
      state.notificationList = { 2: mockNoti };
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
      result.current.actions.deleteNotification(notificationId);
    });
    expect(spy).toBeCalledWith(notificationId);
    expect(result.current.waitingForDelete.length).toBe(1);
    expect(result.current.notificationList).toEqual({ 2: mockNoti });
  });

  it('should delete notification in BE throw error', () => {
    const notificationId = '1';
    const mockNoti = {
      id: '1',
      notificationFlag: 'NOMARL',
      extra: {
        type: 'comment.to_mentioned_user.in_comment',
        actors: [
          {
            id: '623',
            avatar: '',
            fullname: 'Linh Linh',
            username: 'ngoclinh',
          },
        ],
        description: '**Linh Linh** posted in **3** groups',
        content: 'ửyseryesr',
      },
      updated_at: '2023-02-16T02:50:28.238Z',
    };

    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'deleteNotification').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useNotificationStore.setState((state) => {
      state.notificationList = { 1: mockNoti };
      state.waitingForDelete = ['1'];
      return state;
    });

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.waitingForDelete.length).toBe(1);

    act(() => {
      try {
        result.current.actions.deleteNotification(notificationId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalledWith(notificationId);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.waitingForDelete.length).toBe(1);
  });
});
