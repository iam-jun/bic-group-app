import groupApi from '~/api/GroupApi';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import useGroupDetailStore from '../index';

describe('leaveGroup', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';
  const privacy = GroupPrivacyType.OPEN;
  const status = GroupJoinStatus.VISITOR;

  it('should leave group success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spy = jest
      .spyOn(groupApi, 'leaveGroup')
      .mockImplementation(() => Promise.resolve(response) as any);

    const setGroupStatus = jest.fn();
    jest.spyOn(useDiscoverGroupsStore, 'getState').mockImplementation(
      () => ({ actions: { setGroupStatus } } as any),
    );

    const spyApiGetGroupDetail = jest
      .spyOn(groupApi, 'getGroupDetail')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetJoinedAllGroups = jest
      .spyOn(groupApi, 'getJoinedAllGroups')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetManagedCommunityAndGroup = jest
      .spyOn(groupApi, 'getManagedCommunityAndGroup')
      .mockImplementation(() => Promise.resolve(response) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      result.current.actions.leaveGroup(groupId, privacy);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(setGroupStatus).toBeCalledWith(groupId, status);
    expect(spyApiGetGroupDetail).toBeCalledWith(groupId);
    expect(spyApiGetJoinedAllGroups).toBeCalled();
    expect(spyApiGetManagedCommunityAndGroup).toBeCalled();
    expect(showToast).toBeCalledWith({
      content: 'groups:modal_confirm_leave_group:success_message',
      type: ToastType.SUCCESS,
    });
  });

  it('should leave group throw error', () => {
    const error = 'internal error';

    const spy = jest
      .spyOn(groupApi, 'leaveGroup')
      .mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      try {
        result.current.actions.leaveGroup(groupId, privacy);
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
});
