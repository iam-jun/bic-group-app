import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import useGroupMemberStore from '../store';
import SearchMemberView from './SearchMemberView';

describe('SearchMemberView component', () => {
  const groupId = '1';
  const onPressMenu = jest.fn();

  it('should render data list correctly', () => {
    useGroupMemberStore.setState((state) => {
      state.search.key = 'test';
      return state;
    });

    const wrapper = renderWithRedux(
      <SearchMemberView
        groupId={groupId}
        isMemberCommunity
        placeholder="test"
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
});
