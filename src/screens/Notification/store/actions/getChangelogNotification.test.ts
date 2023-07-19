import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import notificationApi from '~/api/NotificationApi';
import { mockChangeLogData } from '~/test/mock_data/notifications';

describe('get notification changelog function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const notificationId = 'a3100e1b-f682-46cc-a6b9-5e30807beba9';
  const activity = mockChangeLogData?.data?.activities?.[0] || {};

  it('should do nothing if notificationId is undefined', () => {
    const spy = jest.spyOn(notificationApi, 'getChangelogNotification').mockImplementation(
      () => Promise.resolve(mockChangeLogData) as any,
    );

    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.getChangelogNotification('');
    });
    expect(spy).not.toBeCalled();
  });

  it('should do nothing if notificationId is empty', () => {
    const spy = jest.spyOn(notificationApi, 'getChangelogNotification').mockImplementation(
      () => Promise.resolve(mockChangeLogData) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.changelogsInfoLoading).toBeFalsy();

    act(() => {
      result.current.actions.getChangelogNotification(notificationId);
    });
    expect(result.current.changelogsInfoLoading).toBeTruthy();
    expect(spy).toBeCalledWith(notificationId);

    act(() => {
      jest.runAllTimers();
    });
    // @ts-ignore
    expect(result.current.changelogsInfo).toEqual(activity.changelogsInfo);
    expect(result.current.changelogsInfoLoading).toBeFalsy();
  });

  it('should get notification changelog in BE success but store not change b.c activity is empty', () => {
    const expectChanglogInfo = { title: '', content: '' };

    const response = {
      code: 200,
      data: {},
    };
    const spy = jest.spyOn(notificationApi, 'getChangelogNotification').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.changelogsInfoLoading).toBeFalsy();

    act(() => {
      result.current.actions.getChangelogNotification(notificationId);
    });
    expect(spy).toBeCalledWith(notificationId);
    expect(result.current.changelogsInfoLoading).toBeTruthy();
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.changelogsInfo).toEqual(expectChanglogInfo);
    expect(result.current.changelogsInfoLoading).toBeFalsy();
  });

  it('should get notification changelog in BE throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'getChangelogNotification').mockImplementation(
      () => Promise.reject(error) as any,
    );
    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationStore((state) => state));
    expect(result.current.changelogsInfoLoading).toBeFalsy();

    act(() => {
      try {
        result.current.actions.getChangelogNotification(notificationId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalledWith(notificationId);

    expect(result.current.changelogsInfoLoading).toBeTruthy();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.changelogsInfoLoading).toBeFalsy();
  });
});
