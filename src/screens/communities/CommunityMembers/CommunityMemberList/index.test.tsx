import React from 'react';
import { render } from '@testing-library/react-native';
import CommunityMemberList from './index';
import { ICommunity } from '~/interfaces/ICommunity';
import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useCommunityMemberStore from '../store';

describe('CommunityMemberList', () => {
  const onPressMenu = jest.fn();
  const community = { groupId: '1' } as ICommunity;

  it('should render member list component correctly', () => {
    const wrapper = render(<CommunityMemberList community={community} onPressMenu={onPressMenu} />);
    const memberList = wrapper.getByTestId('member_list');
    expect(memberList).toBeDefined();
  });

  it('should call getCommunityMembers when component is mounted', () => {
    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(
      () => Promise.resolve({} as any),
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      result.current.actions.getCommunityMembers(community.groupId, false);
    });

    render(<CommunityMemberList community={community} onPressMenu={onPressMenu} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
  });
});
