/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import MemberList from './MemberList';
import { memberDetail, adminDetail } from '~/test/mock_data/group';
import useCommunityMemberStore, { ICommunityMemberState } from '~/screens/communities/CommunityMembers/store';

describe('MemberList component', () => {
  const onLoadMore = jest.fn();
  const onPressMenu = jest.fn();
  const onRefresh = jest.fn();

  const canManageMember = true;

  it('should render data correctly', () => {
    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMembers = {
        loading: false,
        canLoadMore: false,
        offset: 4,
        // @ts-ignore
        communityAdmin: {
          name: 'COMMUNITY_ADMIN',
          userCount: 1,
          data: [adminDetail],
        },
        communityMember: {
          name: 'COMMUNITY_MEMBER',
          userCount: 3,
          data: [memberDetail, memberDetail, memberDetail],
        },
      };
      return state;
    });

    const wrapper = renderWithRedux(
      <MemberList
        type="community"
        canManageMember={canManageMember}
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
    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMembers = {
        loading: false,
        canLoadMore: true,
        offset: 4,
        // @ts-ignore
        communityAdmin: {
          name: 'COMMUNITY_ADMIN',
          userCount: 1,
          data: [adminDetail],
        },
        communityMember: {
          name: 'COMMUNITY_MEMBER',
          userCount: 3,
          data: [memberDetail, memberDetail, memberDetail],
        },
      };
      return state;
    });

    const wrapper = renderWithRedux(
      <MemberList
        type="community"
        canManageMember={canManageMember}
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
});
