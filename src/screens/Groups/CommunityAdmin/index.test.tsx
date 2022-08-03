import React from 'react';
import { renderWithRedux, fireEvent, createTestStore } from '~/test/testUtils';
import CommunityAdmin from '.';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import initialState from '~/store/initialState';

describe('CommunityAdmin component', () => {
  it('should render data correctly', () => {
    const wrapper = renderWithRedux(<CommunityAdmin />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should navigate to pending members correctly', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.communityDetail.id = "1";
    state.groups.myPermissions = {
      data: {
        communities: {
          "1": [
            'approve_reject_community_joining_requests'
          ]
        }
      }
    };
    const store = createTestStore(state);

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return { rootNavigation } as any;
    });

    const wrapper = renderWithRedux(<CommunityAdmin />, store);
    const pendingMember = wrapper.getByTestId(
      'community_admin.pending_members',
    );
    fireEvent.press(pendingMember);
    expect(navigate).toBeCalledWith(groupStack.communityPendingMembers, { id: '1' });
  });
});
