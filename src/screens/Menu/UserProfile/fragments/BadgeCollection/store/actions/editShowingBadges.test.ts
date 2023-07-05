import { act, renderHook } from '~/test/testUtils';
import useUserBadge, { IUserBadgesState, MAX_BADGES } from '../index';
import { mockBadgeList, mockOwnedBadges } from '~/test/mock_data/userProfile';
import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import * as showToastError from '~/store/helper/showToastError';
import useCommonController, { ICommonController } from '~/screens/store';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('editShowingBadges function', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should get owned badges successfully with empty ids', () => {
    const resetChoosingBadgesOrder = jest.fn();
    useUserBadge.setState((state: IUserBadgesState) => {
      state.choosingBadges = [undefined, undefined, undefined];
      state.choosingBadgesOrder = [2, 0, 1];
      state.ownBadges = mockOwnedBadges;
      state.actions.resetChoosingBadgesOrder = resetChoosingBadgesOrder;
      return state;
    });

    const setMyProfile = jest.fn();
    // @ts-ignore
    useCommonController.setState((state: ICommonController) => {
      state.actions.setMyProfile = setMyProfile;
    });

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const response = {
      code: 200,
      meta: {},
    };

    const spyCallApi = jest.spyOn(groupApi, 'putShowingBadges').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.editShowingBadges();
    });

    expect(result.current.loadingEditing).toBeTruthy();
    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingEditing).toBeFalsy();
    expect(result.current.dataSearch.length).toEqual(mockOwnedBadges.length);
    expect(result.current.showingBadges.length).toEqual(0);
    expect(result.current.choosingBadges.length).toEqual(0);
    expect(result.current.isEditing).toBeFalsy();
    expect(resetChoosingBadgesOrder).toBeCalled();

    expect(setMyProfile).toBeCalled();

    expect(showToast).toBeCalledWith({
      content: 'common:text_edit_success',
      type: ToastType.SUCCESS,
    });
  });

  it('should edit badges successfully', () => {
    const resetChoosingBadgesOrder = jest.fn();
    useUserBadge.setState((state: IUserBadgesState) => {
      state.choosingBadges = [undefined, mockBadgeList[0], mockBadgeList[1]];
      state.choosingBadgesOrder = [2, 0, 1];
      state.ownBadges = mockOwnedBadges;
      state.actions.resetChoosingBadgesOrder = resetChoosingBadgesOrder;
      return state;
    });

    const setMyProfile = jest.fn();
    // @ts-ignore
    useCommonController.setState((state: ICommonController) => {
      state.actions.setMyProfile = setMyProfile;
    });

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const response = {
      code: 200,
      meta: {
        message: 'Update Successfully',
      },
    };

    const spyCallApi = jest.spyOn(groupApi, 'putShowingBadges').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));
    act(() => {
      result.current.actions.editShowingBadges();
    });

    expect(result.current.loadingEditing).toBeTruthy();
    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingEditing).toBeFalsy();
    expect(result.current.dataSearch.length).toEqual(mockOwnedBadges.length);
    expect(result.current.showingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.choosingBadges.length).toEqual(MAX_BADGES);
    expect(result.current.isEditing).toBeFalsy();
    expect(resetChoosingBadgesOrder).toBeCalled();

    expect(setMyProfile).toBeCalled();

    expect(showToast).toBeCalledWith({
      content: response.meta.message,
      type: ToastType.SUCCESS,
    });
  });

  it('should edit badges throw error', () => {
    const resetChoosingBadgesOrder = jest.fn();
    useUserBadge.setState((state: IUserBadgesState) => {
      state.choosingBadges = [undefined, mockBadgeList[0], mockBadgeList[1]];
      state.choosingBadgesOrder = [2, 0, 1];
      state.ownBadges = mockOwnedBadges;
      state.actions.resetChoosingBadgesOrder = resetChoosingBadgesOrder;
      return state;
    });

    const error = 'internal error';

    const spyCallApi = jest.spyOn(groupApi, 'putShowingBadges').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useUserBadge((state) => state));

    act(() => {
      try {
        result.current.actions.editShowingBadges();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(result.current.loadingEditing).toBeTruthy();

    expect(spyCallApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingEditing).toBeFalsy();
    expect(spyShowToastError).toBeCalled();
    expect(resetChoosingBadgesOrder).toBeCalled();
  });
});
