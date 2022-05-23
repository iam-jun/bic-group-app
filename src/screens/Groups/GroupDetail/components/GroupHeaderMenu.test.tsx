import React from 'react';
import {Platform as RNPlatform} from 'react-native';
import {createTestStore, renderWithRedux, fireEvent} from '~/test/testUtils';
import GroupHeaderMenu from './GroupHeaderMenu';
import initialState from '~/store/initialState';
import groupJoinStatus from '~/constants/groupJoinStatus';

describe('GroupHeaderMenu component', () => {
  let Platform: any;
  const groupId = '1';

  beforeEach(() => {
    Platform = RNPlatform;
  });

  it('renders correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    const store = createTestStore(state);
    const rendered = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render Admin tool correctly when user is an admin', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    state.groups.groupDetail.join_status = groupJoinStatus.member;
    state.groups.groupDetail.can_setting = true;
    const store = createTestStore(state);
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
      store,
    );
    const itemComponent = queryByTestId('group_header_menu.admin_tools');
    expect(itemComponent).not.toBeNull();
    // @ts-ignore
    fireEvent.press(itemComponent);
  });

  it('should not render Admin tool correctly when user is not an admin', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    state.groups.groupDetail.join_status = groupJoinStatus.member;
    state.groups.groupDetail.can_setting = false;
    const store = createTestStore(state);
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
      store,
    );
    const itemComponent = queryByTestId('group_header_menu.admin_tools');
    expect(itemComponent).toBeNull();
  });

  it('should render Copy link correctly', () => {
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
    );
    const itemComponent = queryByTestId('group_header_menu.copy_link');
    expect(itemComponent).not.toBeNull();
    // @ts-ignore
    fireEvent.press(itemComponent);
  });

  it('should render Share group item correctly on mobile platform', () => {
    Platform.OS = 'ios';
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
    );
    const shareGroupItem = queryByTestId('group_header_menu.share_group');
    expect(shareGroupItem).not.toBeNull();
    // @ts-ignore
    fireEvent.press(shareGroupItem);
    const shareChatItem = queryByTestId('group_header_menu.share_chat');
    expect(shareChatItem).toBeNull();
  });

  it('should render Share chat item correctly on web platform', () => {
    Platform.OS = 'web';
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
    );
    const shareChatItem = queryByTestId('group_header_menu.share_chat');
    expect(shareChatItem).not.toBeNull();
    // @ts-ignore
    fireEvent.press(shareChatItem);
    const shareGroupItem = queryByTestId('group_header_menu.share_group');
    expect(shareGroupItem).toBeNull();
  });

  it('should render Following item correctly', () => {
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
    );
    const itemComponent = queryByTestId('group_header_menu.following');
    expect(itemComponent).not.toBeNull();
    // @ts-ignore
    fireEvent.press(itemComponent);
  });

  it('should render Pin group item correctly', () => {
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
    );
    const itemComponent = queryByTestId('group_header_menu.pin_group');
    expect(itemComponent).not.toBeNull();
    // @ts-ignore
    fireEvent.press(itemComponent);
  });

  it('should render Notifications item correctly', () => {
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
    );
    const itemComponent = queryByTestId('group_header_menu.notifications');
    expect(itemComponent).not.toBeNull();
    // @ts-ignore
    fireEvent.press(itemComponent);
  });

  it('renders Leave Group option when user is a group member correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.join_status = groupJoinStatus.member;
    // @ts-ignore
    state.auth.user = {username: 'Name test'};
    const store = createTestStore(state);
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
      store,
    );
    const itemComponent = queryByTestId('group_header_menu.leave_group');
    expect(itemComponent).not.toBeNull();
    // @ts-ignore
    fireEvent.press(itemComponent);
  });

  it('should not render Leave Group option when user is not a group member correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.join_status = groupJoinStatus.visitor;
    const store = createTestStore(state);
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
      store,
    );
    const itemComponent = queryByTestId('group_header_menu.leave_group');
    expect(itemComponent).toBeNull();
  });
});
