import { act, renderHook } from '~/test/testUtils';
import useDiscoverGroupsStore from '../index';
import IDiscoverGroupsState from '../Interface';
import groupApi from '~/api/GroupApi';
import { mockJoinNewGroupResponse } from '~/test/mock_data/discoverGroup';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('joinNewGroup', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should do nothing if group is joined', () => {
    const spyApi = jest.spyOn(groupApi, 'joinGroup').mockImplementation(
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

  it('should join new group success:', () => {
    const response = mockJoinNewGroupResponse;

    const spyApi = jest.spyOn(groupApi, 'joinGroup').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.items = { testID: { joinStatus: GroupJoinStatus.VISITOR, id: 'testID' } };
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
      result.current.actions.joinNewGroup('testID');
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

  it('should join new group throw error then should show toast', () => {
    const error = 'internal error';
    const spyApi = jest.spyOn(groupApi, 'joinGroup').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions: { showToast } } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useDiscoverGroupsStore((state) => state));

    act(() => {
      try {
        result.current.actions.joinNewGroup('testID');
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
});
