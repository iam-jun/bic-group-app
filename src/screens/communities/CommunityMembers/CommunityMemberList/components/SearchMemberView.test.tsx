import React from 'react';
import { AppConfig } from '~/configs';
import { communityDetailData } from '~/test/mock_data/communities';
import {
  act, fireEvent, render, renderHook, renderWithRedux,
} from '~/test/testUtils';
import { timeOut } from '~/utils/common';
import useCommunityMemberStore from '../../store';
import SearchMemberView from './SearchMemberView';

describe('SearchMemberView component', () => {
  const community = { ...communityDetailData };
  const isOpen = true;
  const onPressMenu = jest.fn();

  it('should render data list correctly', () => {
    const wrapper = renderWithRedux(
      <SearchMemberView
        community={community}
        isOpen={isOpen}
        initSearch="test"
        onPressMenu={onPressMenu}
      />,
    );
    const textComponent = wrapper.queryByTestId(
      'search_member_view.type_search',
    );
    expect(textComponent).toBeNull();

    const dataList = wrapper.getByTestId('flatlist');
    expect(dataList).toBeDefined();
  });

  it('should call API get community members', async () => {
    const searchCommunityMembers = jest.fn();
    jest.spyOn(useCommunityMemberStore, 'getState').mockImplementation(() => ({ actions: { searchCommunityMembers } } as any));
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    result.current.actions.searchCommunityMembers = searchCommunityMembers;
    const searchText = 'test';

    const wrapper = render(
      <SearchMemberView
        community={community}
        isOpen={isOpen}
        onPressMenu={onPressMenu}
      />,
    );

    const searchInput = wrapper.getByTestId('search_input.input');

    act(() => {
      fireEvent.changeText(searchInput, searchText);
    });
    expect(searchInput.props.value).toBe(searchText);
    await timeOut(AppConfig.searchTriggerTime);
    expect(searchCommunityMembers).toBeCalledWith({ key: searchText, groupId: community.groupId });
  });
});
