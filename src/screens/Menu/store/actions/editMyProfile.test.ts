import { act, renderHook } from '~/test/testUtils';
import useMenuController from '../index';
import groupApi from '~/api/GroupApi';
import { GENDER_TYPE, RELATIONSHIP_TYPE } from '~/interfaces/IEditUser';
import { editProfileResponse } from '../__mocks__/data';
import useCommonController from '~/screens/store';
import useModalStore from '~/store/modal';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const fakeProfile = {
  id: 'test_id',
  fullname: 'Full Name',
  username: 'User Name',
  gender: GENDER_TYPE.MALE,
  birthday: '01/08/1998',
  relationshipStatus: RELATIONSHIP_TYPE.SINGLE,
  language: ['en', 'vi'],
};

describe('editMyProfile action', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should edit successfully with full payload', () => {
    const fakeCallback = jest.fn();
    const payload = {
      data: {
        id: fakeProfile.id,
        fullname: fakeProfile.fullname,
      },
      editFieldToastMessage: null,
      callback: fakeCallback,
    };

    const spyCallApi = jest
      .spyOn(groupApi, 'editMyProfile')
      .mockImplementation(() => Promise.resolve(editProfileResponse) as any);

    const setMyProfile = jest.fn();
    const actions = {
      setMyProfile,
    };
    const spyCommonController = jest
      .spyOn(useCommonController, 'getState')
      .mockImplementation(() => ({ actions } as any));

    const toastMessage: IToastMessage = {
      content: 'common:text_edit_success',
      type: ToastType.SUCCESS,
    };
    const showToast = jest.fn();
    jest
      .spyOn(useModalStore, 'getState')
      .mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useMenuController((state) => state));
    act(() => {
      result.current.actions.editMyProfile(payload);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(spyCommonController).toBeCalled();

    expect(showToast).toBeCalledWith(toastMessage);
    expect(fakeCallback).toBeCalled();
  });

  it('should edit successfully with full editFieldToastMessage = text', () => {
    const fakeCallback = jest.fn();
    const payload = {
      data: {
        id: fakeProfile.id,
        fullname: fakeProfile.fullname,
      },
      editFieldToastMessage: 'toast test',
      callback: fakeCallback,
    };

    const spyCallApi = jest
      .spyOn(groupApi, 'editMyProfile')
      .mockImplementation(() => Promise.resolve(editProfileResponse) as any);

    const setMyProfile = jest.fn();
    const actions = {
      setMyProfile,
    };
    const spyCommonController = jest
      .spyOn(useCommonController, 'getState')
      .mockImplementation(() => ({ actions } as any));

    const toastMessage: IToastMessage = {
      content: payload.editFieldToastMessage,
      type: ToastType.SUCCESS,
    };
    const showToast = jest.fn();
    jest
      .spyOn(useModalStore, 'getState')
      .mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useMenuController((state) => state));
    act(() => {
      result.current.actions.editMyProfile(payload);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(spyCommonController).toBeCalled();

    expect(showToast).toBeCalledWith(toastMessage);
    expect(fakeCallback).toBeCalled();
  });

  it('should edit avatar successfully', () => {
    const payload = {
      data: {
        id: fakeProfile.id,
        fullname: fakeProfile.fullname,
        avatar: 'fakeLink',
      },
    };

    const spyCallApi = jest
      .spyOn(groupApi, 'editMyProfile')
      .mockImplementation(() => Promise.resolve(editProfileResponse) as any);

    const setMyProfile = jest.fn();
    const actions = {
      setMyProfile,
    };
    const spyCommonController = jest
      .spyOn(useCommonController, 'getState')
      .mockImplementation(() => ({ actions } as any));

    const toastMessage: IToastMessage = {
      content: 'common:avatar_changed',
      type: ToastType.SUCCESS,
    };
    const showToast = jest.fn();
    jest
      .spyOn(useModalStore, 'getState')
      .mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useMenuController((state) => state));
    act(() => {
      result.current.actions.editMyProfile(payload);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(spyCommonController).toBeCalled();

    expect(showToast).toBeCalledWith(toastMessage);
  });

  it('should edit background successfully', () => {
    const payload = {
      data: {
        id: fakeProfile.id,
        fullname: fakeProfile.fullname,
        backgroundImgUrl: 'fakeLink',
      },
    };

    const spyCallApi = jest
      .spyOn(groupApi, 'editMyProfile')
      .mockImplementation(() => Promise.resolve(editProfileResponse) as any);

    const setMyProfile = jest.fn();
    const actions = {
      setMyProfile,
    };
    const spyCommonController = jest
      .spyOn(useCommonController, 'getState')
      .mockImplementation(() => ({ actions } as any));

    const toastMessage: IToastMessage = {
      content: 'common:cover_changed',
      type: ToastType.SUCCESS,
    };
    const showToast = jest.fn();
    jest
      .spyOn(useModalStore, 'getState')
      .mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useMenuController((state) => state));
    act(() => {
      result.current.actions.editMyProfile(payload);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spyCallApi).toBeCalled();
    expect(spyCommonController).toBeCalled();

    expect(showToast).toBeCalledWith(toastMessage);
  });

  it('should should edit profile throw error:', () => {
    const error = 'error';
    const payload = {
      data: {
        id: fakeProfile.id,
        fullname: fakeProfile.fullname,
        backgroundImgUrl: 'fakeLink',
      },
    };

    const showToast = jest.fn();
    const actions = { showToast };
    jest
      .spyOn(useModalStore, 'getState')
      .mockImplementation(() => ({ actions } as any));

    const spy = jest
      .spyOn(groupApi, 'editMyProfile')
      .mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useMenuController((state) => state));
    act(() => {
      try {
        result.current.actions.editMyProfile(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
  });

  it('should should edit profile throw error in case phone number is used:', () => {
    const error = {
      meta: {
        message: 'This phone number is used',
      },
    };
    const payload = {
      data: {
        id: fakeProfile.id,
        phone: '09877777777777',
      },
    };

    const setEditContactError = jest.fn();

    useMenuController.setState((state) => {
      state.actions.setEditContactError = setEditContactError;
      return state;
    });

    const spy = jest
      .spyOn(groupApi, 'editMyProfile')
      .mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useMenuController((state) => state));
    act(() => {
      try {
        result.current.actions.editMyProfile(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(setEditContactError).toBeCalled();
  });
});
