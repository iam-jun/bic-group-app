import React from 'react';

import MemberItem from './MemberItem';
import initialState from '~/store/initialState';
import {renderWithRedux, createTestStore, fireEvent} from '~/test/testUtils';
import {adminDetail} from '~/test/mock_data/communities';
import * as navigationHook from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

describe('MemberItem component', () => {
  it('should render data correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'test'};
    const item = {...adminDetail};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<MemberItem item={item} />, store);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render icon chat correctly when user is an admin', () => {
    const onPressChat = jest.fn();
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'anothertest'};
    state.groups.communityDetail.can_manage_member = true;
    const item = {...adminDetail};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberItem item={item} onPressChat={onPressChat} />,
      store,
    );
    const iconClose = wrapper.getByTestId('member_item.icon_chat.button');
    expect(iconClose).toBeDefined();
    fireEvent.press(iconClose);
    expect(onPressChat).toBeCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should NOT render icon chat correctly when user is NOT an admin', () => {
    const onPressChat = jest.fn();
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'anothertest'};
    state.groups.communityDetail.can_manage_member = false;
    const item = {...adminDetail};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberItem item={item} onPressChat={onPressChat} />,
      store,
    );
    const iconClose = wrapper.queryByTestId('member_item.icon_chat.button');
    expect(iconClose).toBeNull();
  });

  it('should navigate to User profile correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'test'};
    const item = {...adminDetail};
    const store = createTestStore(state);
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const wrapper = renderWithRedux(<MemberItem item={item} />, store);

    const memberItem = wrapper.getByTestId('member_item');
    fireEvent.press(memberItem);
    expect(navigate).toBeCalledWith(mainStack.userProfile, {
      userId: adminDetail.id,
    });
  });
});
