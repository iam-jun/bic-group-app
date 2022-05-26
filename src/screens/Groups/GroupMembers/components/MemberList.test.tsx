import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import MemberList from './MemberList';
import {memberData, memberDetail, adminDetail} from '~/test/mock_data/group';
import initialState from '~/store/initialState';

describe('Group MemberList component', () => {
  const onLoadMore = jest.fn();
  const onPressMenu = jest.fn();

  it('should render data correctly', () => {
    const state = {...initialState};
    state.groups.groupMembers = {
      loading: false,
      canLoadMore: false,
      group_admin: {data: [adminDetail], user_count: 1},
      group_member: {
        data: [memberDetail, memberDetail, memberDetail],
        user_count: 3,
      },
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberList onLoadMore={onLoadMore} onPressMenu={onPressMenu} />,
      store,
    );
    const dataItem = wrapper.getAllByTestId('member_list.item');
    expect(wrapper).toMatchSnapshot();
    expect(dataItem.length).toBe(4);
  });

  it('should render loading more indicator correctly when getting more data', () => {
    const state = {...initialState};
    state.groups.groupMembers = {
      loading: false,
      canLoadMore: true,
      group_admin: {
        data: memberData.group_admin.data,
        user_count: memberData.group_admin.user_count,
      },
      group_member: {
        data: memberData.group_member.data,
        user_count: memberData.group_member.user_count,
      },
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberList onLoadMore={onLoadMore} onPressMenu={onPressMenu} />,
      store,
    );

    const loadingIndicator = wrapper.getByTestId(
      'member_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly when no data left from API', () => {
    const state = {...initialState};
    state.groups.groupMembers = {
      loading: false,
      canLoadMore: false,
      group_admin: {
        data: memberData.group_admin.data,
        user_count: memberData.group_admin.user_count,
      },
      group_member: {
        data: memberData.group_member.data,
        user_count: memberData.group_member.user_count,
      },
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberList onLoadMore={onLoadMore} onPressMenu={onPressMenu} />,
      store,
    );

    const loadingIndicator = wrapper.queryByTestId(
      'member_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeNull();
  });

  it('should NOT render loading indicator when refreshing', () => {
    const state = {...initialState};
    state.groups.groupMembers = {
      loading: true,
      canLoadMore: true,
      group_admin: {
        data: [],
        user_count: 0,
      },
      group_member: {
        data: [],
        user_count: 0,
      },
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberList onLoadMore={onLoadMore} onPressMenu={onPressMenu} />,
      store,
    );
    const loadingIndicator = wrapper.queryByTestId(
      'member_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeNull();
  });
});
