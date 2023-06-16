import { act, renderHook } from '~/test/testUtils';
import useNotificationStore from '../index';
import notificationApi from '~/api/NotificationApi';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('markAsReadAll function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  it('call api mark as read all successfully', async () => {
    const response = {
      code: 200,
    };
    const spy = jest.spyOn(notificationApi, 'markAsReadAll').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    useNotificationStore.setState((state) => {
      state.tabUnread.data = ['1'];
      state.unseenNumber = 1;
      state.notificationList = { 1: { id: '1' }, 2: { id: '2' } };
      return state;
    });

    const { result, waitForNextUpdate } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      result.current.actions.markAsReadAll('ALL');
    });
    expect(spy).toBeCalled();

    await waitForNextUpdate();

    expect(result.current.tabUnread.data.length).toEqual(0);
    expect(result.current.tabUnread.noMoreData).toBeTruthy();
    expect(result.current.tabUnread.loading).toBeFalsy();
    expect(result.current.unseenNumber).toEqual(0);
    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should call api mark as read all throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'markAsReadAll').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationStore((state) => state));

    act(() => {
      try {
        result.current.actions.markAsReadAll('ALL');
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
