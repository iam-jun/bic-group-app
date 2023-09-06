import { act, renderHook } from '~/test/testUtils';
import useModalStore from '~/store/modal';
import usePersonalPrivacy from '../index';
import { mockPersonalInfoVisibilityResponse } from '~/test/mock_data/privacyCenter';
import userApi from '~/api/UserApi';
import { INVITATION_PRIVACY_TYPE } from '~/constants/privacyCenter';

describe('editInvitationPrivacy function', () => {
  it('should edit personal info visibility success', () => {
    const response = mockPersonalInfoVisibilityResponse;
    const spyApi = jest.spyOn(userApi, 'editPersonalInfoSettings').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const payload = INVITATION_PRIVACY_TYPE.MANUALLY_ACCEPT;

    usePersonalPrivacy.setState((state) => {
      state.invitationPrivacy = INVITATION_PRIVACY_TYPE.HIDE_NOTIFICATION;
      return state;
    });
    jest.useFakeTimers();

    const { result } = renderHook(() => usePersonalPrivacy((state) => state));
    expect(result.current.invitationPrivacy).toEqual(INVITATION_PRIVACY_TYPE.HIDE_NOTIFICATION);
    act(() => {
      result.current.actions.editInvitationPrivacy(payload);
    });
    expect(spyApi).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.invitationPrivacy).toEqual(payload);
  });

  it('should edit personal info visibility throw error and should show toast', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(userApi, 'editPersonalInfoSettings').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const payload = INVITATION_PRIVACY_TYPE.HIDE_NOTIFICATION;

    usePersonalPrivacy.setState((state) => {
      state.invitationPrivacy = INVITATION_PRIVACY_TYPE.MANUALLY_ACCEPT;
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => usePersonalPrivacy((state) => state));
    expect(result.current.invitationPrivacy).toEqual(INVITATION_PRIVACY_TYPE.MANUALLY_ACCEPT);

    act(() => {
      try {
        result.current.actions.editInvitationPrivacy(payload);
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
    expect(result.current.invitationPrivacy).toEqual(payload);
    expect(showToast).toBeCalled();
  });
});
