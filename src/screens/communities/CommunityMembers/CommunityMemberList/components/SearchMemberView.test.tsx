import React from 'react';
import { communityDetailData } from '~/test/mock_data/communities';
import { act, fireEvent, render } from '~/test/testUtils';
import useCommunityMemberStore from '../../store';
import SearchMemberView from './SearchMemberView';
import { timeOut } from '~/utils/common';
import { AppConfig } from '~/configs';

describe('SearchMemberView component', () => {
  const community = { ...communityDetailData };
  const onPressMenu = jest.fn();

  it('should render data list correctly', async () => {
    const searchCommunityMembers = jest.fn();
    useCommunityMemberStore.setState((state) => {
      state.actions.searchCommunityMembers = searchCommunityMembers;
      return state;
    });

    const wrapper = render(
      <SearchMemberView community={community} isMember placeholder="test" onPressMenu={onPressMenu} />,
    );

    const { getByTestId } = wrapper;

    const containerView = getByTestId('search_member_view');
    expect(containerView).toBeDefined();

    const searchInput = getByTestId('search_input.input');
    act(() => {
      fireEvent.changeText(searchInput, 'test');
    });
    await timeOut(AppConfig.searchTriggerTime);
    expect(searchCommunityMembers).toBeCalled();
  });
});
