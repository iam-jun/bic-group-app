import { Auth } from 'aws-amplify';
import { cloneDeep } from 'lodash';
import { t } from 'i18next';
import { act, renderHook } from '~/test/testUtils';
import useChangePasswordStore from '../index';
import { IChangePasswordPayload } from '~/interfaces/IAuth';
import { amplifyUser } from '~/test/mock_data/auth';
import useModalStore from '~/store/modal';
import { authErrors } from '~/constants/authConstants';

describe('changePassword', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const showToast = jest.fn();
  const actions = { showToast };
  jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

  const payload: IChangePasswordPayload = {
    global: false,
    newPassword: 'test_2',
    oldPassword: 'test_1',
  };

  it('should changePassword success (global = false)', () => {
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => amplifyUser);
    Auth.changePassword = jest.fn().mockImplementation(() => 'SUCCESS');
    jest.useFakeTimers();
    const { result } = renderHook(() => useChangePasswordStore((state) => state));
    act(() => {
      result.current.actions.changePassword(payload);
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
    expect(result.current.loading).toEqual(false);
    expect(result.current.errorText).toEqual('');
  });

  it('should changePassword success (global = true)', () => {
    const payloadClone = cloneDeep(payload);
    payloadClone.global = true;

    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => amplifyUser);
    Auth.changePassword = jest.fn().mockImplementation(() => 'SUCCESS');
    Auth.signOut = jest.fn().mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useChangePasswordStore((state) => state));
    act(() => {
      result.current.actions.changePassword(payloadClone);
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(Auth.signOut).toBeCalled();
  });

  it('should changePassword throw error', () => {
    const error = {
      code: authErrors.NOT_AUTHORIZED_EXCEPTION,
    };

    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useChangePasswordStore((state) => state));
    act(() => {
      try {
        result.current.actions.changePassword(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toEqual(false);
    expect(result.current.errorText).toEqual(t('auth:text_err_wrong_current_password'));
  });
});
