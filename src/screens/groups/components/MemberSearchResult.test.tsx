import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import MemberSearchResult from './MemberSearchResult';
import { adminDetail, memberDetail } from '~/test/mock_data/communities';

describe('MemberSearchResult component', () => {
  const onPressMenu = jest.fn();
  const onLoadMore = jest.fn();

  it('should NOT render empty screen correctly when loading', () => {
    const wrapper = renderWithRedux(
      <MemberSearchResult
        canManageMember
        memberSearchData={{ loading: true, canLoadMore: true, data: [] }}
        isAdminRole
        onPressMenu={onPressMenu}
        onLoadMore={onLoadMore}
      />,
    );
    const emptyText = wrapper.queryByTestId('member_search_result.no_results');
    expect(emptyText).toBeNull();
  });

  it('should NOT render empty screen correctly when having data and NOT loading', () => {
    const wrapper = renderWithRedux(
      <MemberSearchResult
        canManageMember
        memberSearchData={{
          loading: false,
          canLoadMore: true,
          data: [adminDetail, memberDetail],
        }}
        isAdminRole
        onPressMenu={onPressMenu}
        onLoadMore={onLoadMore}
      />,
    );
    const emptyText = wrapper.queryByTestId('member_search_result.no_results');
    expect(emptyText).toBeNull();
  });

  it('should render empty screen correctly when having NO data and NO loading', () => {
    const wrapper = renderWithRedux(
      <MemberSearchResult
        canManageMember
        memberSearchData={{
          loading: false,
          canLoadMore: true,
          data: [],
        }}
        isAdminRole
        onPressMenu={onPressMenu}
        onLoadMore={onLoadMore}
      />,
    );
    const emptyText = wrapper.getByTestId('no_search_results');
    expect(emptyText).toBeDefined();
  });

  it('should render loading more indicator correctly', () => {
    const wrapper = renderWithRedux(
      <MemberSearchResult
        canManageMember
        memberSearchData={{
          loading: false,
          canLoadMore: true,
          data: [adminDetail, memberDetail],
        }}
        isAdminRole
        onPressMenu={onPressMenu}
        onLoadMore={onLoadMore}
      />,
    );
    const loadingIndicator = wrapper.getByTestId(
      'member_search_result.loading_more',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly', () => {
    const wrapper = renderWithRedux(
      <MemberSearchResult
        canManageMember
        memberSearchData={{
          loading: true,
          canLoadMore: true,
          data: [],
        }}
        isAdminRole
        onPressMenu={onPressMenu}
        onLoadMore={onLoadMore}
      />,
    );
    const loadingIndicator = wrapper.queryByTestId(
      'member_search_result.loading_more',
    );
    expect(loadingIndicator).toBeNull();
  });

  it('should render data correctly', () => {
    const wrapper = renderWithRedux(
      <MemberSearchResult
        canManageMember
        memberSearchData={{
          loading: false,
          canLoadMore: false,
          data: [adminDetail, memberDetail],
        }}
        isAdminRole
        onPressMenu={onPressMenu}
        onLoadMore={onLoadMore}
      />,
    );
    const flatlist = wrapper.getByTestId('flatlist');
    expect(flatlist).toBeDefined();
    const items = wrapper.getAllByTestId('member_item');
    expect(items.length).toBe(2);
  });
});
