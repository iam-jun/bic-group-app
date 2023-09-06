import { act, renderHook } from '~/test/testUtils';
import useModalStore from '~/store/modal';
import useVisibilityPrivacyStore from '../index';
import { mockPersonalInfoVisibilityResponse } from '~/test/mock_data/privacyCenter';
import userApi from '~/api/UserApi';
import { PERSONAL_INFORMATION_VISIBILITY_TYPE } from '~/constants/privacyCenter';

describe('getPersonalInfoVisibility function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should get personal info visibility success', () => {
    const response = mockPersonalInfoVisibilityResponse;
    const spyApi = jest.spyOn(userApi, 'getVisibilityPrivacy').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useVisibilityPrivacyStore((state) => state));
    act(() => {
      result.current.actions.getPersonalInfoVisibility();
    });
    expect(result.current.loading).toBeTruthy();
    expect(spyApi).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.visibilityPrivacy).toEqual(response.data.visibilityPrivacy);
  });

  it('should get personal info visibility success but visibilityPrivacy is undefined', () => {
    const response = {
      code: 'api.ok',
      meta: {
        message: 'Success',
      },
      data: {
      },
    };
    const spyApi = jest.spyOn(userApi, 'getVisibilityPrivacy').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useVisibilityPrivacyStore((state) => state));
    act(() => {
      result.current.actions.getPersonalInfoVisibility();
    });
    expect(result.current.loading).toBeTruthy();
    expect(spyApi).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.visibilityPrivacy).toEqual(PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE);
  });

  it('should get personal info visibility throw error and should show toast', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(userApi, 'getVisibilityPrivacy').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useVisibilityPrivacyStore((state) => state));

    act(() => {
      try {
        result.current.actions.getPersonalInfoVisibility();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(result.current.loading).toBeTruthy();
    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(showToast).toBeCalled();
  });
});
