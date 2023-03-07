import { act, renderHook } from '~/test/testUtils';
import useMenuController from '../index';
import { uploadApiConfig } from '~/api/UploadApi';
import useAuthController from '~/screens/auth/store';

describe('uploadImage actions', () => {
  //   afterEach(() => {
  //     jest.runOnlyPendingTimers(); // you must add this
  //     jest.useRealTimers(); // you must add this
  //   });
  const fakePayload = {
    id: 'id',
    fieldName: 'avatar',
    file: 'test file',
    uploadType: 'test upload Type',
  };

  it('should upload image of profile successfully:', () => {
    const response = { data: { data: { url: 'fake url' } } };
    const fakeCallback = jest.fn();
    const fakeEditMyProfileAction = jest.fn();

    const spyCallApi = jest
      .spyOn(uploadApiConfig, 'uploadImage')
      .mockImplementation(() => Promise.resolve(response) as any);

    const mockToken = {
      authUser: {
        signInUserSession: {
          idToken: {
            jwtToken: 'tokennnnnnn',
          },
        },
      },
    };
    jest
      .spyOn(useAuthController, 'getState')
      .mockImplementation(() => mockToken as any);

    useMenuController.setState((state) => {
      state.actions.editMyProfile = fakeEditMyProfileAction;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useMenuController((state) => state));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      result.current.actions.uploadImage(fakePayload as any, fakeCallback);
    });

    expect(result.current.loading).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(fakeCallback).toBeCalled();
    expect(fakeEditMyProfileAction).toBeCalled();
  });

  //   it('should upload image of profile throw error:', () => {
  //     const error = 'error';
  //     const payload = { previewMembers: true, managed: true };
  //     const spyCallApi = jest
  //       .spyOn(groupApi, 'getJoinedCommunities')
  //       .mockImplementation(() => Promise.reject(error) as any);

  //           const showToast = jest.fn();
  //           const actions = { showToast };
  //           jest
  //             .spyOn(useModalStore, 'getState')
  //             .mockImplementation(() => ({ actions } as any));

  //     jest.useFakeTimers();

  //     const { result } = renderHook(() => useMenuController((state) => state));

  //     expect(result.current.loading).toBeTruthy();

  //     act(() => {
  //       try {
  //         result.current.actions.getJoinedCommunities(payload);
  //       } catch (e) {
  //         expect(e).toBeInstanceOf(TypeError);
  //         expect(e).toBe(error);
  //       }
  //     });

  //     expect(result.current.loading).toBeTruthy();

  //     act(() => {
  //       jest.runAllTimers();
  //     });

  //     expect(spyCallApi).toBeCalled();
  //     expect(result.current.loading).toBeFalsy();

  //     expect(showToast).toBeCalled();
  //   });
});
