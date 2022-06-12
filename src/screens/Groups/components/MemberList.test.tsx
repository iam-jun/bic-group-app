import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import MemberList from './MemberList';
import {memberDetail, adminDetail} from '~/test/mock_data/group';

describe('MemberList component', () => {
  const onLoadMore = jest.fn();
  const onPressMenu = jest.fn();
  const onRefresh = jest.fn();

  const canManageMember = true;
  const memberData = {
    loading: false,
    canLoadMore: false,
    sectionList: [
      {title: 'Admins', data: [adminDetail], user_count: 1},
      {
        title: 'Members',
        data: [memberDetail, memberDetail, memberDetail],
        user_count: 3,
      },
    ],
  };

  it('should render data correctly', () => {
    const wrapper = renderWithRedux(
      <MemberList
        canManageMember={canManageMember}
        memberData={memberData}
        onLoadMore={onLoadMore}
        onPressMenu={onPressMenu}
        onRefresh={onRefresh}
      />,
    );
    const dataItem = wrapper.getAllByTestId('member_item');
    expect(wrapper).toMatchSnapshot();
    expect(dataItem.length).toBe(4);
  });

  it('should render loading more indicator correctly when getting more data', () => {
    memberData.canLoadMore = true;

    const wrapper = renderWithRedux(
      <MemberList
        canManageMember={canManageMember}
        memberData={memberData}
        onLoadMore={onLoadMore}
        onPressMenu={onPressMenu}
        onRefresh={onRefresh}
      />,
    );

    const loadingIndicator = wrapper.getByTestId(
      'member_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly when no data left from API', () => {
    memberData.canLoadMore = false;
    const wrapper = renderWithRedux(
      <MemberList
        canManageMember={canManageMember}
        memberData={memberData}
        onLoadMore={onLoadMore}
        onPressMenu={onPressMenu}
        onRefresh={onRefresh}
      />,
    );

    const loadingIndicator = wrapper.queryByTestId(
      'member_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeNull();
  });
});
