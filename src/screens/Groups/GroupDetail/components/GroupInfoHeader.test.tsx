import React from 'react';

import {renderWithRedux, createTestStore, fireEvent} from '~/test/testUtils';
import GroupInfoHeader from './GroupInfoHeader';
import initialState from '~/store/initialState';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupDetailData} from '~/test/mock_data/group';

describe('GroupInfoHeader component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<GroupInfoHeader />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders button Join correctly', () => {
    const {queryByTestId} = renderWithRedux(<GroupInfoHeader />);

    // only Join button is available
    const joinButton = queryByTestId('group_info_header.join');
    expect(joinButton).not.toBeNull();
    // @ts-ignore
    fireEvent.press(joinButton);
    const cancelButton = queryByTestId('group_info_header.cancel');
    expect(cancelButton).toBeNull();
  });

  it('renders button Cancel Request correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.join_status = groupJoinStatus.requested;
    const store = createTestStore(state);
    const {queryByTestId} = renderWithRedux(<GroupInfoHeader />, store);

    //  only Cancel button is available
    const joinButton = queryByTestId('group_info_header.join');
    expect(joinButton).toBeNull();
    const cancelButton = queryByTestId('group_info_header.cancel');
    expect(cancelButton).not.toBeNull();
    // @ts-ignore
    fireEvent.press(cancelButton);
  });

  it('should hide Join and Cancel buttons when user is a group member correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.join_status = groupJoinStatus.member;
    const store = createTestStore(state);
    const {queryByTestId} = renderWithRedux(<GroupInfoHeader />, store);

    // Join and Cancel buttons are not available
    const joinButton = queryByTestId('group_info_header.join');
    expect(joinButton).toBeNull();
    const cancelButton = queryByTestId('group_info_header.cancel');
    expect(cancelButton).toBeNull();
  });

  it('should render group name correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail = {...groupDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupInfoHeader />, store);
    const name = wrapper.getByTestId('group_info_header.name');
    expect(name.props.children).toBe(groupDetailData.group.name);
  });

  it('should render group privacy correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail = {...groupDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupInfoHeader />, store);
    const privacy = wrapper.getByTestId('group_info_header.privacy');
    expect(privacy.props.children).toBe('Public');
  });

  it('should render group member count correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail = {...groupDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupInfoHeader />, store);
    const member = wrapper.getByTestId('group_info_header.member_count');
    expect(member.props.children).toBe(groupDetailData.group.user_count);
  });

  it('should render cover image', () => {
    const state = {...initialState};
    state.groups.groupDetail = {...groupDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupInfoHeader />, store);
    const cover = wrapper.getByTestId('group_info_header.cover');
    expect(cover).toBeDefined();
  });

  it('should render avatar image', () => {
    const state = {...initialState};
    state.groups.groupDetail = {...groupDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupInfoHeader />, store);
    const avatar = wrapper.getByTestId('avatar');
    expect(avatar).toBeDefined();
  });
});
