import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CommunityJoinCancelButton from './index';
import { communityDetailData } from '~/test/mock_data/communities';
import useCommunityController from '~/screens/communities/store';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useTermStore from '~/components/TermsModal/store';

describe('CommunitItem component', () => {
  const community = communityDetailData;
  it('should render button join and call joinCoumminty in useCoumintyControllder when press button', () => {
    const isMember = false;

    const joinCommunity = jest.fn();
    useCommunityController.setState((state) => {
      state.actions.joinCommunity = joinCommunity;
      return state;
    });

    const wrapper = renderWithRedux(<CommunityJoinCancelButton
      community={community}
      isMember={isMember}
    />);
    const commponent = wrapper.getByTestId('join_cancel_button');
    expect(commponent).toBeDefined();

    const buttonComp = wrapper.getByTestId('join_cancel_button.join');
    expect(buttonComp).toBeDefined();

    fireEvent.press(buttonComp);
    expect(joinCommunity).toBeCalled();
  });

  it('should render button join and call joinCoumminty in useCoumintyControllder when press button', () => {
    const isMember = false;
    const mockData = {
      ...communityDetailData,
      settings: {
        isJoinApproval: true,
        isActiveGroupTerms: true,
      },
    };

    const setTermInfo = jest.fn();
    useTermStore.setState((state) => {
      state.actions.setTermInfo = setTermInfo;
      return state;
    });

    const wrapper = renderWithRedux(<CommunityJoinCancelButton
      community={mockData}
      isMember={isMember}
    />);
    const commponent = wrapper.getByTestId('join_cancel_button');
    expect(commponent).toBeDefined();

    const buttonComp = wrapper.getByTestId('join_cancel_button.join');
    expect(buttonComp).toBeDefined();

    fireEvent.press(buttonComp);
    expect(setTermInfo).toBeCalled();
  });

  it('should render button cancle join request and call cancelJoinCommunity when press button', () => {
    const mockData = { ...communityDetailData, joinStatus: GroupJoinStatus.REQUESTED };
    const cancelJoinCommunity = jest.fn();
    useCommunityController.setState((state) => {
      state.actions.cancelJoinCommunity = cancelJoinCommunity;
      return state;
    });

    const wrapper = renderWithRedux(<CommunityJoinCancelButton
      community={mockData}
      isMember={false}
    />);
    const commponent = wrapper.getByTestId('join_cancel_button');
    expect(commponent).toBeDefined();

    const buttonComp = wrapper.getByTestId('join_cancel_button.cancel');
    expect(buttonComp).toBeDefined();

    fireEvent.press(buttonComp);
    expect(cancelJoinCommunity).toBeCalled();
  });
});
