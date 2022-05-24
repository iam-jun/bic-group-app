import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import PreviewMembers from './PreviewMembers';
import initialState from '~/store/initialState';
import {
  communityDetailData,
  previewMemberData,
  memberDetail,
  previewMemberDetail,
} from '~/test/mock_data/communities';

describe('PreviewMembers component', () => {
  it('should render avatar list correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      members: previewMemberData,
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PreviewMembers />, store);
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(previewMemberData.length);
  });

  it('should render member description text correctly when there is only 1 member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      members: [previewMemberDetail],
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PreviewMembers />, store);
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText.props.children).toBe(
      `${memberDetail.fullname} is a member`,
    );
  });

  it('should render member description text correctly when there are only 2 members', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      user_count: 2,
      members: [previewMemberDetail, previewMemberDetail],
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PreviewMembers />, store);
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText.props.children).toBe(
      `${memberDetail.fullname} and 1 other are members`,
    );
  });

  it('should render member description text correctly when there are >2 members', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      members: [previewMemberDetail, previewMemberDetail],
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<PreviewMembers />, store);
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText.props.children).toBe(
      `${memberDetail.fullname} and 4 others are members`,
    );
  });
});
