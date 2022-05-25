import React from 'react';

import MemberItem from './MemberItem';
import initialState from '~/store/initialState';
import {renderWithRedux, createTestStore, fireEvent} from '~/test/testUtils';
import {adminDetail} from '~/test/mock_data/communities';

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

  it('should render icon chat correctly when that is not current user', () => {
    const onPressChat = jest.fn();
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'anothertest'};
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
});
