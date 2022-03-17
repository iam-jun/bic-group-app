import React from 'react';

import {createTestStore, renderWithRedux, fireEvent} from '~/test/testUtils';
import GroupAboutContent from './GroupAboutContent';
import initialState from '~/store/initialState';
import {groupDetailData} from '~/test/mock_data/group';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

describe('GroupAboutContent component', () => {
  it('should LoadingIndicator correctly when there is no group info', () => {
    const state = {...initialState};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupAboutContent />, store);
    const member = wrapper.getByTestId('loading_indicator');
    expect(member).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render description text correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail = {...groupDetailData};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(<GroupAboutContent />, store);
    const description = wrapper.getByTestId('collapsible_text.content');
    expect(description.props.children).toBe(groupDetailData.group.description);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render member correctly', () => {
    const wrapper = renderWithRedux(<GroupAboutContent />);
    const member = wrapper.getByTestId('group_about_content.members');
    expect(member).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });

  it('should navigate to member screen correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail = {...groupDetailData};
    const store = createTestStore(state);

    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const wrapper = renderWithRedux(<GroupAboutContent />, store);
    const member = wrapper.getByTestId('group_about_content.members');
    expect(member).toBeDefined();
    fireEvent.press(member);

    expect(navigate).toBeCalledWith(groupStack.groupMembers, {
      groupId: groupDetailData.group.id,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render group privacy correctly', () => {
    const wrapper = renderWithRedux(<GroupAboutContent />);
    const member = wrapper.getByTestId('group_about_content.privacy');
    expect(member).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
