import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import SearchMemberView from './SearchMemberView';

describe('SearchMemberView component', () => {
  const groupId = '1';
  const isOpen = true;
  const onPressMenu = jest.fn();

  it('should render data list correctly', () => {
    const wrapper = renderWithRedux(
      <SearchMemberView
        groupId={groupId}
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
});
