import React from 'react';
import useCommunityMemberStore, { ICommunityMemberState } from '~/screens/communities/CommunityMembers/store';
import { createTestStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import MemberRequestList from './MemberRequestList';
import { memberRequestDetail, communityDetailData } from '~/test/mock_data/communities';

describe('MemberRequestList', () => {
  const onLoadMore = jest.fn();
  const onRefresh = jest.fn();
  const onPressAdd = jest.fn();

  it('should render empty screen when data is empty and loading = false', () => {
    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMemberRequests.total = 0;
      state.communityMemberRequests.loading = false;
      state.communityMemberRequests.canLoadMore = false;
      state.communityMemberRequests.ids = [];
      state.communityMemberRequests.items = {};
      return state;
    });
    const wrapper = renderWithRedux(
      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        onPressAdd={onPressAdd}
      />,
    );
    const emptyScreen = wrapper.getByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
  });

  it('should NOT render empty screen when loading = true', () => {
    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMemberRequests.total = 0;
      state.communityMemberRequests.loading = true;
      state.communityMemberRequests.canLoadMore = true;
      state.communityMemberRequests.ids = [];
      state.communityMemberRequests.items = {};
      return state;
    });

    const wrapper = renderWithRedux(
      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        onPressAdd={onPressAdd}
      />,
    );
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeNull();
  });

  it('should NOT render request title correctly when there is no data', () => {
    const state = { ...initialState };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        onPressAdd={onPressAdd}
      />,
      store,
    );
    const textRequest = wrapper.queryByTestId(
      'member_request_list.request_title',
    );
    expect(textRequest).toBeNull();
  });

  it('should render loading more correctly', () => {
    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMemberRequests.total = 1;
      state.communityMemberRequests.loading = false;
      state.communityMemberRequests.canLoadMore = true;
      state.communityMemberRequests.ids = ['1'];
      state.communityMemberRequests.items = {
        1: memberRequestDetail,
      };
      return state;
    });

    const wrapper = renderWithRedux(
      <MemberRequestList
        id={communityDetailData.id}
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        onPressAdd={onPressAdd}
      />,
    );
    const loadingIndicator = wrapper.getByTestId(
      'member_request_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should render data correctly', () => {
    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMemberRequests.total = 1;
      state.communityMemberRequests.loading = false;
      state.communityMemberRequests.canLoadMore = false;
      state.communityMemberRequests.ids = [memberRequestDetail.id];
      state.communityMemberRequests.items = {
        [memberRequestDetail.id]: { ...memberRequestDetail },
      };
      return state;
    });

    const wrapper = renderWithRedux(
      <MemberRequestList
        id={communityDetailData.id}
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        onPressAdd={onPressAdd}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
