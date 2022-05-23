import React from 'react';

import {renderWithRedux} from '~/test/testUtils';
import ContentData from './ContentData';
import {
  memberData,
  memberDetail,
  adminDetail,
} from '~/test/mock_data/communities';

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
    const wrapper = renderWithRedux(
      <ContentData
        sectionList={sectionList}
        loading={loading}
        canLoadMore={canLoadMore}
      />,
    );
    const dataItem = wrapper.getAllByTestId('content_data.item');
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
        data: memberData.member.data,
        user_count: memberData.member.user_count,
      },
    ];
    const loading = false;
    const canLoadMore = true;

    const wrapper = renderWithRedux(
      <ContentData
        sectionList={sectionList}
        loading={loading}
        canLoadMore={canLoadMore}
      />,
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
        data: memberData.member.data,
        user_count: memberData.member.user_count,
      },
    ];
    const loading = false;
    const canLoadMore = false;

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
