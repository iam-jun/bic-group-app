/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import AboutContent from './AboutContent';
import initialState from '~/store/initialState';
import {
  communityDetailData,
  previewMemberDetail,
} from '~/test/mock_data/communities';
import { COMMUNITY_PRIVACY_TYPE } from '~/constants/privacyTypes';

describe('AboutContent component', () => {
  it('should render member item correctly', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      members: [previewMemberDetail, previewMemberDetail],
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<AboutContent />, store);
    const member = wrapper.getByTestId('about_content.members');
    expect(member).toBeDefined();
  });

  it('should render privacy item correctly', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      members: [previewMemberDetail, previewMemberDetail],
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<AboutContent />, store);
    const member = wrapper.getByTestId('about_content.privacy');
    expect(member).toBeDefined();
  });

  it('should render description text correctly', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      members: [previewMemberDetail, previewMemberDetail],
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    const description = wrapper.getByTestId('collapsible_text.content');
    expect(description.props.children).toBe(communityDetailData.description);
  });

  it('should render PreviewMembers when user is a member', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      privacy: 'PRIVATE',
      members: [previewMemberDetail, previewMemberDetail],
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    // render avatar list
    const listData = wrapper.getByTestId('list_view');
    expect(listData).toBeDefined();
    // render member description
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText).toBeDefined();
  });

  it('should render PreviewMembers when user is not a member and the privacy is OPEN', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      joinStatus: 1,
      privacy: 'OPEN' as COMMUNITY_PRIVACY_TYPE,
      members: [previewMemberDetail],
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    // render avatar list
    const listData = wrapper.getByTestId('list_view');
    expect(listData).toBeDefined();
    // render member description
    const memberText = wrapper.getByTestId('preview_members.description');
    expect(memberText).toBeDefined();
  });

  it('should NOT render PreviewMembers when user is not a member and the privacy is PRIVATE', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      joinStatus: 1,
      privacy: 'PRIVATE',
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    // not render avatar list
    const listData = wrapper.queryByTestId('list_view');
    expect(listData).toBeNull();
    // not render member description
    const memberText = wrapper.queryByTestId('preview_members.description');
    expect(memberText).toBeNull();
  });

  it('should render right icon when user is a member', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      privacy: 'PRIVATE',
      members: [previewMemberDetail],
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    const rightIcon = wrapper.getByTestId('menu_item.right_sub_icon');
    expect(rightIcon).toBeDefined();
  });

  it('should render right icon when user is not a member and the privacy is OPEN', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      privacy: 'OPEN' as COMMUNITY_PRIVACY_TYPE,
      joinStatus: 1,
      members: [previewMemberDetail],
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    const rightIcon = wrapper.getByTestId('menu_item.right_sub_icon');
    expect(rightIcon).toBeDefined();
  });

  it('should NOT render right icon when user is not a member and the privacy is PRIVATE', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      privacy: 'PRIVATE',
      joinStatus: 1,
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<AboutContent />, store);
    const rightIcon = wrapper.queryByTestId('menu_item.right_sub_icon');
    expect(rightIcon).toBeNull();
  });
});
