import { act, renderHook } from '~/test/testUtils';
import notificationApi from '~/api/NotificationApi';
import useNotificationItemMenu from '../index';
import { SpecificNotificationType } from '~/interfaces/INotification';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('editNotificationSettings function', () => {
  const targetId = '123';
  it('should edit settings successfully and ', () => {
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const response = {
      code: 200,
      data: true,
      meta: {
        message: 'OK',
      },
    };
    const spy = jest.spyOn(notificationApi, 'editSpecificNotificationSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useNotificationItemMenu.setState((state) => {
      state.targetType = SpecificNotificationType.post;
      state.enableNotificationSettings = false;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationItemMenu((state) => state));
    expect(result.current.enableNotificationSettings).toBeFalsy();

    act(() => {
      result.current.actions.editNotificationSettings(targetId, true);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.enableNotificationSettings).toBeTruthy();
    expect(showToast).toBeCalledWith({ content: response.meta.message });
  });

  it('should get settings successfully if data is undefined', () => {
    const response = {
      code: 200,
      data: true,
    };
    const spy = jest.spyOn(notificationApi, 'editSpecificNotificationSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useNotificationItemMenu.setState((state) => {
      state.targetType = SpecificNotificationType.post;
      state.enableNotificationSettings = false;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useNotificationItemMenu((state) => state));
    expect(result.current.enableNotificationSettings).toBeFalsy();

    act(() => {
      result.current.actions.editNotificationSettings(targetId, true);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.enableNotificationSettings).toBeTruthy();
  });

  it('should edit settings throw error', () => {
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const error = 'internal error';
    const spy = jest.spyOn(notificationApi, 'editSpecificNotificationSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useNotificationItemMenu.setState((state) => {
      state.targetType = SpecificNotificationType.post;
      state.enableNotificationSettings = true;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationItemMenu((state) => state));
    expect(result.current.enableNotificationSettings).toBeTruthy();

    act(() => {
      try {
        result.current.actions.editNotificationSettings(targetId, false);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.enableNotificationSettings).toBeFalsy();
    expect(showToast).toBeCalledWith({ content: 'common:text_please_try_again', type: ToastType.ERROR });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
