/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import MockedNavigator from '~/test/MockedNavigator';
import { createTestStore, renderWithRedux } from '~/test/testUtils';
import GroupDetail from '.';
import initialState from '~/storeRedux/initialState';
import { groupDetailData } from '~/test/mock_data/group';
import { GroupPrivacyType } from '~/constants/privacyTypes';

describe('GroupDetail component', () => {
  const component = () => (
    <GroupDetail route={{ params: { groupId: groupDetailData.group.id } }} />
  );

  it('renders Placeholder  correctly', () => {
    const state = { ...initialState };
    state.groups.loadingPage = true;
    const store = createTestStore(state);

    const { getByTestId } = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const placeholder = getByTestId('group_detail.placeholder');
    expect(placeholder).toBeDefined();
  });

  it('renders GroupPrivateWelcome when user is a visitor to a private group', () => {
    const state = { ...initialState };
    state.groups.groupDetail = {
      ...groupDetailData,
      joinStatus: 1,
      group: { ...groupDetailData.group, privacy: GroupPrivacyType.PRIVATE },
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
    const state = { ...initialState };
    state.groups.loadingPage = false;
    // @ts-ignore
    state.groups.groupDetail = { group: {} };
    state.groups.isLoadingGroupDetailError = true;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const groupPrivateWelcome = wrapper.getByTestId('no_group_found');
    expect(groupPrivateWelcome).toBeDefined();
  });
});
