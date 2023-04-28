import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import notificationApi from '~/api/NotificationApi';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('markAsSeenAll function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  const mockNotifications = { 1: { id: '1' }, 2: { id: '2' } };

  it('call api mark as seen all successfully', async () => {
    const response = {
      code: 200,
    };
    const spy = jest.spyOn(notificationApi, 'markAsSeenAll').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useNotificationStore.setState((state) => {
      state.unseenNumber = 1;
      state.notificationList = mockNotifications;
      return state;
    });

    const expectNotifications = { 1: { id: '1', isSeen: true }, 2: { id: '2', isSeen: true } };

    const { result, waitForNextUpdate } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.markAsSeenAll();
    });
    expect(spy).toBeCalled();

    await waitForNextUpdate();

    expect(result.current.notificationList).toEqual(expectNotifications);
    expect(result.current.unseenNumber).toEqual(0);
  });

  it('should call api mark as seen all throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'markAsSeenAll').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      try {
        result.current.actions.markAsSeenAll();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'common:text_error_message',
      type: ToastType.ERROR,
    });
  });
});
