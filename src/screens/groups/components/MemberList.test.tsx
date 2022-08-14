/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { renderWithRedux, createTestStore } from '~/test/testUtils';
import MemberList from './MemberList';
import { memberDetail, adminDetail } from '~/test/mock_data/group';
import initialState from '~/storeRedux/initialState';

describe('MemberList component', () => {
  const onLoadMore = jest.fn();
  const onPressMenu = jest.fn();
  const onRefresh = jest.fn();

  const canManageMember = true;

  it('should render data correctly', () => {
    const state = { ...initialState };
    state.groups.communityMembers = {
      loading: false,
      canLoadMore: false,
      offset: 4,
      // @ts-ignore
      community_admin: {
        name: 'COMMUNITY_ADMIN',
        userCount: 1,
        data: [adminDetail],
      },
      community_member: {
        name: 'COMMUNITY_MEMBER',
        userCount: 3,
        data: [memberDetail, memberDetail, memberDetail],
      },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MemberList
        type="community"
        canManageMember={canManageMember}
        onLoadMore={onLoadMore}
        onPressMenu={onPressMenu}
        onRefresh={onRefresh}
      />,
      store,
    );
    const dataItem = wrapper.getAllByTestId('member_item');
    expect(wrapper).toMatchSnapshot();
    expect(dataItem.length).toBe(4);
  });

  it('should render loading more indicator correctly when getting more data', () => {
    const state = { ...initialState };
    state.groups.communityMembers = {
      loading: false,
      canLoadMore: true,
      offset: 4,
      // @ts-ignore
      community_admin: {
        name: 'COMMUNITY_ADMIN',
        userCount: 1,
        data: [adminDetail],
      },
      community_member: {
        name: 'COMMUNITY_MEMBER',
        userCount: 3,
        data: [memberDetail, memberDetail, memberDetail],
      },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MemberList
        type="community"
        canManageMember={canManageMember}
        onLoadMore={onLoadMore}
        onPressMenu={onPressMenu}
        onRefresh={onRefresh}
      />,
      store,
    );

    const loadingIndicator = wrapper.getByTestId(
      'member_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly when no data left from API', () => {
    const state = { ...initialState };
    state.groups.communityMembers = {
      loading: false,
      canLoadMore: false,
      offset: 4,
      // @ts-ignore
      community_admin: {
        name: 'COMMUNITY_ADMIN',
        userCount: 1,
        data: [adminDetail],
      },
      community_member: {
        name: 'COMMUNITY_MEMBER',
        userCount: 3,
        data: [memberDetail, memberDetail, memberDetail],
      },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MemberList
        type="community"
        canManageMember={canManageMember}
        onLoadMore={onLoadMore}
        onPressMenu={onPressMenu}
        onRefresh={onRefresh}
      />,
      store,
    );

    const loadingIndicator = wrapper.queryByTestId(
      'member_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeNull();
  });
});
