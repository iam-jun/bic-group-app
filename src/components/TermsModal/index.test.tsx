import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';

import TermsView from './index';
import { languages, renderWithRedux } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useTermStore from './store';
import useCommunityController from '~/screens/communities/store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';

afterEach(cleanup);

describe('TermsView component', () => {
  it('renders correctly when show terms of community', () => {
    const response = { data: { content: 'TEST TERMS' } };
    jest.spyOn(groupApi, 'getGroupTerms')
      .mockImplementation(() => Promise.resolve(response) as any);

    useTermStore.setState((state) => {
      state.isActiveGroupTerms = true;
      state.rootGroupId = 'test';
      state.type = 'community';
      state.isOpen = true;
      state.termContent = response.data.content;
      return state;
    });

    const joinCommunity = jest.fn();
    useCommunityController.setState((state) => {
      state.actions.joinCommunity = joinCommunity;
      return state;
    });

    const wrapper = renderWithRedux(<TermsView />);
    const component = wrapper.getByTestId('terms_view');
    expect(component).toBeDefined();

    const headerComp = wrapper.queryByTestId('header.text');
    expect(headerComp).toBeDefined();
    expect(headerComp.children[0]).toEqual(languages.common.text_community_terms);

    const checkBoxComp = wrapper.queryByTestId('terms_view.check_box');
    expect(checkBoxComp).toBeDefined();
    fireEvent.press(checkBoxComp);

    const buttonSubmit = wrapper.queryByTestId('terms_view.sumbit');
    expect(buttonSubmit).toBeDefined();
    fireEvent.press(buttonSubmit);
    expect(joinCommunity).toBeCalled();
  });

  it('renders correctly when show terms of group', () => {
    const response = { data: { content: 'TEST TERMS' } };
    jest.spyOn(groupApi, 'getGroupTerms')
      .mockImplementation(() => Promise.resolve(response) as any);

    useTermStore.setState((state) => {
      state.isActiveGroupTerms = true;
      state.rootGroupId = 'test';
      state.type = 'group';
      state.isOpen = true;
      state.termContent = response.data.content;
      return state;
    });

    const joinNewGroup = jest.fn();
    useDiscoverGroupsStore.setState((state) => {
      state.actions.joinNewGroup = joinNewGroup;
      return state;
    });

    const wrapper = renderWithRedux(<TermsView />);
    const component = wrapper.getByTestId('terms_view');
    expect(component).toBeDefined();

    const headerComp = wrapper.queryByTestId('header.text');
    expect(headerComp).toBeDefined();
    expect(headerComp.children[0]).toEqual(languages.common.text_group_terms);

    const checkBoxComp = wrapper.queryByTestId('terms_view.check_box');
    expect(checkBoxComp).toBeDefined();
    fireEvent.press(checkBoxComp);

    const buttonSubmit = wrapper.queryByTestId('terms_view.sumbit');
    expect(buttonSubmit).toBeDefined();
    fireEvent.press(buttonSubmit);
    expect(joinNewGroup).toBeCalled();
  });

  it('renders correctly when isOpen = false', () => {
    useTermStore.setState((state) => {
      state.isOpen = false;
      return state;
    });

    const wrapper = renderWithRedux(<TermsView />);
    const component = wrapper.queryByTestId('terms_view');
    expect(component).toBeNull();
  });

  it('renders correctly when press back to close modal', () => {
    const response = { data: { content: 'TEST TERMS' } };
    jest.spyOn(groupApi, 'getGroupTerms')
      .mockImplementation(() => Promise.resolve(response) as any);

    const setIsOpen = jest.fn();

    useTermStore.setState((state) => {
      state.isActiveGroupTerms = true;
      state.rootGroupId = 'test';
      state.type = 'group';
      state.isOpen = true;
      state.termContent = response.data.content;
      state.actions.setIsOpen = setIsOpen;
      return state;
    });

    const wrapper = renderWithRedux(<TermsView />);
    const component = wrapper.getByTestId('terms_view');
    expect(component).toBeDefined();

    const headerBackComp = wrapper.queryByTestId('header.back.button');
    expect(headerBackComp).toBeDefined();
    fireEvent.press(headerBackComp);
    expect(setIsOpen).toBeCalled();
  });
});
