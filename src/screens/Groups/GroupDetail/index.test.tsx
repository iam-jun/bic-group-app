import React from 'react';
import MockedNavigator from '~/test/MockedNavigator';
import {createTestStore, renderWithRedux} from '~/test/testUtils';
import GroupDetail from '.';
import initialState from '~/store/initialState';
import {groupDetailData} from '~/test/mock_data/group';

describe('GroupDetail component', () => {
  const component = () => (
    <GroupDetail route={{params: {groupId: groupDetailData.group.id}}} />
  );

  it('renders Placeholder  correctly', () => {
    const state = {...initialState};
    state.groups.loadingPage = true;
    const store = createTestStore(state);

    const {getByTestId} = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const placeholder = getByTestId('group_detail.placeholder');
    expect(placeholder).toBeDefined();
  });

  it('renders group detail correctly when user is a group member', () => {
    const state = {...initialState};
    state.groups.loadingPage = false;
    state.groups.groupDetail = {...groupDetailData};
    // @ts-ignore
    state.auth.user = {username: 'testname'};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const detailView = wrapper.getByTestId('group_detail.content');
    expect(detailView).toBeDefined();
    const listView = wrapper.getByTestId('list_view');
    expect(listView).toBeDefined();
    const groupTopBar = wrapper.getByTestId('group_top_bar');
    expect(groupTopBar).toBeDefined();
  });

  it('renders GroupPrivateWelcome when user is a visitor to a private group', () => {
    const state = {...initialState};
    state.groups.groupDetail = {
      ...groupDetailData,
      join_status: 1,
      group: {...groupDetailData.group, privacy: 'PRIVATE'},
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const groupPrivateWelcome = wrapper.getByTestId('group_private_welcome');
    expect(groupPrivateWelcome).toBeDefined();
  });

  it('renders NoGroupFound when there is no group info', () => {
    const state = {...initialState};
    state.groups.loadingPage = false;
    // @ts-ignore
    state.groups.groupDetail = {group: {}};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const groupPrivateWelcome = wrapper.getByTestId('no_group_found');
    expect(groupPrivateWelcome).toBeDefined();
  });

  it('renders NoGroupFound when user is not a member and the group is secret', () => {
    const state = {...initialState};
    state.groups.loadingPage = false;
    state.groups.groupDetail = {
      ...groupDetailData,
      join_status: 1,
      group: {...groupDetailData.group, privacy: 'SECRET'},
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const groupPrivateWelcome = wrapper.getByTestId('no_group_found');
    expect(groupPrivateWelcome).toBeDefined();
  });
});
