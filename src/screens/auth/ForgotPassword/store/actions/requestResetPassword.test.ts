import { Auth } from 'aws-amplify';
import { forgotPasswordStages } from '~/constants/authConstants';
import { act, renderHook } from '~/test/testUtils';
import useForgotPasswordStore from '../index';

describe('requestResetPassword', () => {
  it('should do nothing if email is empty', () => {
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));
    act(() => {
      result.current.actions.requestResetPassword('');
    });

    expect(result.current.loadingRequest).not.toBe(true);
  });

  it('should request forgot password success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spyRequestForgotPassword = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));
    act(() => {
      result.current.actions.requestResetPassword('email@tgm.vn');
    });

    expect(spyRequestForgotPassword).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingRequest).toBe(false);
    expect(result.current.screenCurrentStage).toBe(forgotPasswordStages.INPUT_CODE_PW);
    expect(result.current.errorRequest).toBe('');
  });

  it('should request forgot password throw error and call callbackError prop', () => {
    const error = { message: 'ERRORRRRR!' };
    const spy = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.reject(error),
    );

    const callbackError = jest.fn();

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));

    act(() => {
      try {
        result.current.actions.requestResetPassword('email@tgm.vn', callbackError);
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingRequest).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(callbackError).toBeCalled();
    expect(result.current.loadingRequest).toBeFalsy();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
