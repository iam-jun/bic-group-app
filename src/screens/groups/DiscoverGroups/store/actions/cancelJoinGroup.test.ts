import { act, renderHook } from '~/test/testUtils';
import useDiscoverGroupsStore from '../index';
import IDiscoverGroupsState from '../Interface';
import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import approveDeclineCode from '~/constants/approveDeclineCode';
import { mockJoinNewGroupResponse } from '~/test/mock_data/discoverGroup';

describe('cancelJoinGroup', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if group is joined', () => {
    const spyApi = jest.spyOn(groupApi, 'cancelJoinGroup').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.items = { testID: { joinStatus: GroupJoinStatus.MEMBER, id: 'testID' } };
      return state;
    });

    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));
    act(() => {
      result.current.actions.joinNewGroup('testID');
    });
    expect(spyApi).not.toBeCalled();
  });

  it('should cancel join request group success:', () => {
    const response = mockJoinNewGroupResponse;

    const spyApi = jest.spyOn(groupApi, 'cancelJoinGroup').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.items = { testID: { joinStatus: GroupJoinStatus.REQUESTED, id: 'testID' } };
      return state;
    });

    const getGroupDetail = jest.fn();
    const spyGroupDetailStore = jest.spyOn(useGroupDetailStore, 'getState').mockImplementation(
      () => ({ actions: { getGroupDetail } } as any),
    );

    const showToast = jest.fn();
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));
    act(() => {
      result.current.actions.cancelJoinGroup('testID');
    });

    expect(result.current.loading).toBeTruthy();
    expect(result.current.noGroupInCommuntity).toBeFalsy();

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyGroupDetailStore).toBeCalled();
    expect(showToast).toBeCalled();
  });

  it('should cancel join request group throw error then should show toast', () => {
    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.items = { testID: { joinStatus: GroupJoinStatus.REQUESTED, id: 'testID' } };
      return state;
    });

    const error = 'internal error';
    const spyApi = jest.spyOn(groupApi, 'cancelJoinGroup').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));

    act(() => {
      try {
        result.current.actions.cancelJoinGroup('testID');
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({ content: 'common:text_error_message', type: ToastType.ERROR });
  });

  it('should cancel join request group throw error when request is approved then should show toast', () => {
    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.items = { testID: { joinStatus: GroupJoinStatus.REQUESTED, id: 'testID' } };
      return state;
    });

    const error = { code: approveDeclineCode.APPROVED, meta: { message: 'error' } };
    const spyApi = jest.spyOn(groupApi, 'cancelJoinGroup').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: { showToast } } as any));

    const getGroupDetail = jest.fn();
    const spyGroupDetailStore = jest.spyOn(useGroupDetailStore, 'getState').mockImplementation(
      () => ({ actions: { getGroupDetail } } as any),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));

    act(() => {
      try {
        result.current.actions.cancelJoinGroup('testID');
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyGroupDetailStore).toBeCalled();
    expect(showToast).toBeCalledWith({ content: error.meta.message, type: ToastType.NEUTRAL });
  });

  it('should cancel join request group throw error when request is declined then should show toast', () => {
    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.items = { testID: { joinStatus: GroupJoinStatus.REQUESTED, id: 'testID' } };
      return state;
    });

    const error = { code: approveDeclineCode.DECLINED, meta: { message: 'error' } };
    const spyApi = jest.spyOn(groupApi, 'cancelJoinGroup').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: { showToast } } as any));

    const getGroupDetail = jest.fn();
    const spyGroupDetailStore = jest.spyOn(useGroupDetailStore, 'getState').mockImplementation(
      () => ({ actions: { getGroupDetail } } as any),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));

    act(() => {
      try {
        result.current.actions.cancelJoinGroup('testID');
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    expect(spyApi).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyGroupDetailStore).toBeCalled();
    expect(showToast).toBeCalledWith({ content: error.meta.message, type: ToastType.NEUTRAL });
  });
});
