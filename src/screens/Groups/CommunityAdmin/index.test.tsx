import React from 'react';
import {renderWithRedux, fireEvent} from '~/test/testUtils';
import CommunityAdmin from '.';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

describe('CommunityAdmin component', () => {
  it('should render data correctly', () => {
    const wrapper = renderWithRedux(<CommunityAdmin />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should navigate to pending members correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const wrapper = renderWithRedux(<CommunityAdmin />);
    const pendingMember = wrapper.getByTestId(
      'community_admin.pending_members',
    );
    fireEvent.press(pendingMember);
    expect(navigate).toBeCalledWith(groupStack.communityPendingMembers);
  });
});
