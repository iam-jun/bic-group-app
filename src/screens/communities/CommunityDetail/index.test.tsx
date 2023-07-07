import React from 'react';

import { act } from 'react-test-renderer';
import { render } from '~/test/testUtils';
import MockedNavigator from '../../../test/MockedNavigator';
import CommunityDetail from './index';
import { communityDetailData } from '~/test/mock_data/communities';
import useCommunitiesStore from '~/store/entities/communities';
import { CommunityPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

describe('CommunityDetail', () => {
  const component = () => (
    <CommunityDetail route={{ params: { communityId: communityDetailData.id } }} />
  );

  it('renders Placeholder  correctly', () => {
    const wrapper = render(
      <MockedNavigator component={component} />,
    );
    const placeholder = wrapper.getByTestId('community_detail.placeholder');
    expect(placeholder).toBeDefined();
    const pageContent = wrapper.queryByTestId('community_detail.content');
    expect(pageContent).toBeNull();
  });

  it('should render PrivateWelcome page for guest', () => {
    useCommunitiesStore.setState((state) => {
      state.data = {
        [communityDetailData.id]: {
          ...communityDetailData,
          joinStatus: GroupJoinStatus.VISITOR,
          privacy: CommunityPrivacyType.PRIVATE,
        },
      };
      return state;
    });

    const wrapper = render(
      <MockedNavigator component={component} />,
    );
    const PrivateWelcomeComp = wrapper.getByTestId('private_welcome');
    expect(PrivateWelcomeComp).toBeDefined();
  });

  it('should render PageContent page correctly when user is a member', async () => {
    const getCommunity = jest.fn();
    useCommunitiesStore.setState((state) => {
      state.actions.getCommunity = getCommunity;
      state.data = {
        [communityDetailData.id]: communityDetailData,
      };
      return state;
    });
    const wrapper = render(
      <MockedNavigator component={component} />,
    );
    const listView = wrapper.queryByTestId('flatlist');
    expect(listView).not.toBeNull();

    const { refreshControl } = listView.props;
    await act(async () => {
      refreshControl.props.onRefresh();
    });
    expect(getCommunity).toBeCalled();
  });

  it('should render PageContent page correctly when user is not a member for OPEN privacy type', () => {
    useCommunitiesStore.setState((state) => {
      state.data = {
        [communityDetailData.id]: {
          ...communityDetailData,
          joinStatus: GroupJoinStatus.VISITOR,
          privacy: CommunityPrivacyType.OPEN,
        },
      };
      return state;
    });

    const wrapper = render(
      <MockedNavigator component={component} />,
    );

    // should render PageContent component
    const listView = wrapper.queryByTestId('flatlist');
    expect(listView).not.toBeNull();
  });

  it('should not render chat icon correctly for PRIVATE privacy type when user is a guest', () => {
    useCommunitiesStore.setState((state) => {
      state.data = {
        [communityDetailData.id]: {
          ...communityDetailData,
          joinStatus: GroupJoinStatus.VISITOR,
          privacy: CommunityPrivacyType.PRIVATE,
        },
      };
      return state;
    });

    const wrapper = render(
      <MockedNavigator component={component} />,
    );
    const chatIcon = wrapper.queryByTestId('header.icon_chat');
    expect(chatIcon).toBeNull();
  });
});
