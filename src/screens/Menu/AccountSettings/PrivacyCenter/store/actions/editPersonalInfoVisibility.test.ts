import { act, renderHook } from '~/test/testUtils';
import useModalStore from '~/store/modal';
import useVisibilityPrivacyStore from '../index';
import { mockPersonalInfoVisibilityResponse } from '~/test/mock_data/privacyCenter';
import userApi from '~/api/UserApi';
import { PERSONAL_INFORMATION_VISIBILITY_TYPE } from '~/constants/privacyCenter';

describe('editPersonalInfoVisibility function', () => {
  it('should edit personal info visibility success', () => {
    const response = mockPersonalInfoVisibilityResponse;
    const spyApi = jest.spyOn(userApi, 'editVisibilityPrivacy').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const payload = PERSONAL_INFORMATION_VISIBILITY_TYPE.ONLY_ME;

    useVisibilityPrivacyStore.setState((state) => {
      state.visibilityPrivacy = PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE;
      return state;
    });
    jest.useFakeTimers();

    const { result } = renderHook(() => useVisibilityPrivacyStore((state) => state));
    expect(result.current.visibilityPrivacy).toEqual(PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE);
    act(() => {
      result.current.actions.editPersonalInfoVisibility(payload);
    });
    expect(spyApi).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.visibilityPrivacy).toEqual(payload);
  });

  it('should edit personal info visibility throw error and should show toast', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(userApi, 'editVisibilityPrivacy').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const payload = PERSONAL_INFORMATION_VISIBILITY_TYPE.ONLY_ME;

    useVisibilityPrivacyStore.setState((state) => {
      state.visibilityPrivacy = PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useVisibilityPrivacyStore((state) => state));
    expect(result.current.visibilityPrivacy).toEqual(PERSONAL_INFORMATION_VISIBILITY_TYPE.EVERYONE);

    act(() => {
      try {
        result.current.actions.editPersonalInfoVisibility(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.visibilityPrivacy).toEqual(payload);
    expect(showToast).toBeCalled();
  });
});
