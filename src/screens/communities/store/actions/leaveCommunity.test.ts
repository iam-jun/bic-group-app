import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { CommunityPrivacyType } from '~/constants/privacyTypes';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';
import useCommunityController from '../index';

describe('leaveCommunity', () => {
  const communityId = '879c8129-0840-437f-8f23-a7585dc6ba22';
  const privacy = CommunityPrivacyType.OPEN;
  const status = GroupJoinStatus.VISITOR;

  it('should leave community success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spy = jest
      .spyOn(groupApi, 'leaveCommunity')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyEditDiscoverCommunityItem = jest.spyOn(
      groupsActions,
      'editDiscoverCommunityItem',
    );

    const spyApiGetManagedCommunityAndGroup = jest
      .spyOn(groupApi, 'getManagedCommunityAndGroup')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetOwnerCommunity = jest
      .spyOn(groupApi, 'getOwnerCommunity')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyApiGetJoinedCommunities = jest
      .spyOn(groupApi, 'getJoinedCommunities')
      .mockImplementation(() => Promise.resolve(response) as any);

    const spyModalActions = jest.spyOn(
      modalActions,
      'showHideToastMessage',
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityController((state) => state));
    act(() => {
      result.current.actions.leaveCommunity(communityId, privacy);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyEditDiscoverCommunityItem).toBeCalledWith({
      id: communityId,
      data: { joinStatus: status },
    });
    expect(spyApiGetManagedCommunityAndGroup).toBeCalled();
    expect(spyApiGetOwnerCommunity).toBeCalled();
    expect(spyApiGetJoinedCommunities).toBeCalled();
    expect(spyModalActions).toBeCalledWith({
      content: 'communities:modal_confirm_leave_community:success_message',
      props: { type: 'success' },
    });
  });

  it('should leave community throw error', () => {
    const error = 'internal error';

    const spy = jest
      .spyOn(groupApi, 'leaveCommunity')
      .mockImplementation(() => Promise.reject(error) as any);

    const spyModalActions = jest.spyOn(
      modalActions,
      'showHideToastMessage',
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityController((state) => state));
    act(() => {
      try {
        result.current.actions.leaveCommunity(communityId, privacy);
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
