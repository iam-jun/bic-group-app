import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import JoinCancelButton from './JoinCancelButton';
import { CommunityPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

describe('CommunitItem component', () => {
  it('should render button join and call onPressJoin when press button', () => {
    const joinStatus = GroupJoinStatus.VISITOR;
    const privacy = CommunityPrivacyType.OPEN;
    const onPressJoin = jest.fn();
    const onPressCancelRequest = jest.fn();

    const wrapper = renderWithRedux(<JoinCancelButton
      type="community"
      style={{}}
      joinStatus={joinStatus}
      privacy={privacy}
      onPressJoin={onPressJoin}
      onPressCancelRequest={onPressCancelRequest}
    />);
    const commponent = wrapper.getByTestId('join_cancel_button');
    expect(commponent).toBeDefined();

    const buttonComp = wrapper.getByTestId('join_cancel_button.join');
    expect(buttonComp).toBeDefined();

    fireEvent.press(buttonComp);
    expect(onPressJoin).toBeCalled();
  });

  it('should render button cancle join request and call onPressCancelRequest when press button', () => {
    const joinStatus = GroupJoinStatus.REQUESTED;
    const privacy = CommunityPrivacyType.OPEN;
    const onPressJoin = jest.fn();
    const onPressCancelRequest = jest.fn();

    const wrapper = renderWithRedux(<JoinCancelButton
      type="community"
      style={{}}
      joinStatus={joinStatus}
      privacy={privacy}
      onPressJoin={onPressJoin}
      onPressCancelRequest={onPressCancelRequest}
    />);
    const commponent = wrapper.getByTestId('join_cancel_button');
    expect(commponent).toBeDefined();

    const buttonComp = wrapper.getByTestId('join_cancel_button.cancel');
    expect(buttonComp).toBeDefined();

    fireEvent.press(buttonComp);
    expect(onPressCancelRequest).toBeCalled();
  });
});
