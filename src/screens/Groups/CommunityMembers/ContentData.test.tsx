import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import ContentData from './ContentData';
import {
  memberData,
  memberDetail,
  adminDetail,
} from '~/test/mock_data/communities';
import initialState from '~/store/initialState';

describe('Community members - ContentData component', () => {
  it('should render data correctly', () => {
    const loading = false;
    const canLoadMore = false;
    const sectionList = [
      {
        title: 'Admins',
        data: [adminDetail],
        user_count: 1,
      },
      {
        title: 'Members',
        data: [memberDetail, memberDetail, memberDetail],
        user_count: 3,
      },
    ];
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname'};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <ContentData
        sectionList={sectionList}
        loading={loading}
        canLoadMore={canLoadMore}
      />,
      store,
    );
    const dataItem = wrapper.getAllByTestId('member_item');
    expect(wrapper).toMatchSnapshot();
    expect(dataItem.length).toBe(4);
  });

  it('should render loading more indicator correctly when getting more data', () => {
    const sectionList = [
      {
        title: 'Admins',
        data: memberData.community_admin.data,
        user_count: memberData.community_admin.user_count,
      },
      {
        title: 'Members',
        data: memberData.community_member.data,
        user_count: memberData.community_member.user_count,
      },
    ];
    const loading = false;
    const canLoadMore = true;
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname'};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <ContentData
        sectionList={sectionList}
        loading={loading}
        canLoadMore={canLoadMore}
      />,
      store,
    );
    const loadingIndicator = wrapper.getByTestId(
      'content_data.loading_more_indicator',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly when no data left from API', () => {
    const sectionList = [
      {
        title: 'Admins',
        data: memberData.community_admin.data,
        user_count: memberData.community_admin.user_count,
      },
      {
        title: 'Members',
        data: memberData.community_member.data,
        user_count: memberData.community_member.user_count,
      },
    ];
    const loading = false;
    const canLoadMore = false;
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname'};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <ContentData
        sectionList={sectionList}
        loading={loading}
        canLoadMore={canLoadMore}
      />,
      store,
    );
    const loadingIndicator = wrapper.queryByTestId(
      'content_data.loading_more_indicator',
    );
    expect(loadingIndicator).toBeNull();
  });

  it('should NOT render loading indicator when refreshing', () => {
    const sectionList = [
      {
        title: 'Admins',
        data: [],
        user_count: 0,
      },
      {
        title: 'Members',
        data: [],
        user_count: 0,
      },
    ];
    const loading = true;
    const canLoadMore = true;
    const wrapper = renderWithRedux(
      <ContentData
        sectionList={sectionList}
        loading={loading}
        canLoadMore={canLoadMore}
      />,
    );
    const loadingIndicator = wrapper.queryByTestId(
      'content_data.loading_more_indicator',
    );
    expect(loadingIndicator).toBeNull();
  });
});
