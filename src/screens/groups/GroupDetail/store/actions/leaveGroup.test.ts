import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';
import useGroupDetailStore from '../index';

describe('leaveGroup', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';
  const privacy = GroupPrivacyType.PUBLIC;
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

    const doSetGroupStatus = jest.fn();
    jest.spyOn(useDiscoverGroupsStore, 'getState').mockImplementation(
      () => ({ doSetGroupStatus } as any),
    );

    const spyGetGroupDetail = jest.spyOn(groupsActions, 'getGroupDetail');

    const spyApiGetJoinedAllGroups = jest
      .spyOn(groupApi, 'getJoinedAllGroups')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetManagedCommunityAndGroup = jest
      .spyOn(groupApi, 'getManagedCommunityAndGroup')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetOwnerCommunity = jest
      .spyOn(groupApi, 'getOwnerCommunity')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyModalActions = jest.spyOn(
      modalActions,
      'showHideToastMessage',
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      result.current.actions.leaveGroup(groupId, privacy);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(doSetGroupStatus).toBeCalledWith(groupId, status);
    expect(spyGetGroupDetail).toBeCalledWith({ groupId });
    expect(spyApiGetJoinedAllGroups).toBeCalled();
    expect(spyApiGetManagedCommunityAndGroup).toBeCalled();
    expect(spyApiGetOwnerCommunity).toBeCalled();
    expect(spyModalActions).toBeCalledWith({
      content: 'groups:modal_confirm_leave_group:success_message',
      props: { type: 'success' },
    });
  });

  it('should leave group throw error', () => {
    const error = 'internal error';

    const spy = jest
      .spyOn(groupApi, 'leaveGroup')
      .mockImplementation(() => Promise.reject(error) as any);

    const spyModalActions = jest.spyOn(
      modalActions,
      'showHideToastMessage',
    );

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

    expect(spyModalActions).toBeCalled();
  });
});
