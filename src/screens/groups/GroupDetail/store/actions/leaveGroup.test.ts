import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import { act, renderHook } from '~/test/testUtils';
import useGroupDetailStore from '../index';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

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

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

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
    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should leave group throw error', () => {
    const error = 'internal error';

    const spy = jest
      .spyOn(groupApi, 'leaveGroup')
      .mockImplementation(() => Promise.reject(error) as any);

    const spyShowToastError = jest.spyOn(showToastError, 'default');

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

    expect(spyShowToastError).toBeCalled();
  });
});
