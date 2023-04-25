import * as React from 'react';

import MemberQuestionsModal from './index';
import { act, fireEvent, renderWithRedux } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useMemberQuestionsStore from './store';
import useCommunityController from '~/screens/communities/store';
import { MEMBERSHIP_QUESITONS } from '~/test/mock_data/group';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import useTermStore from '../TermsModal/store';

describe('MemberQuestionsModal component', () => {
  it('renders correctly when show questions', () => {
    const newIds = MEMBERSHIP_QUESITONS.map((item) => item.id);
    const newItems = MEMBERSHIP_QUESITONS.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    const response = { data: MEMBERSHIP_QUESITONS };
    const spy = jest.spyOn(groupApi, 'getMembershipQuestions')
      .mockImplementation(() => Promise.resolve(response) as any);

    const joinCommunity = jest.fn();
    useCommunityController.setState((state) => {
      state.actions.joinCommunity = joinCommunity;
      return state;
    });
    const wrapper = renderWithRedux(<MemberQuestionsModal />);

    act(() => {
      useMemberQuestionsStore.setState((state) => {
        state.isActive = true;
        state.rootGroupId = 'test';
        state.type = 'community';
        state.ids = newIds;
        state.questions = newItems;
        state.answers = {};
        state.loading = false;
        state.isOpen = true;
        return state;
      });
    });
    expect(spy).toBeCalled();
    const component = wrapper.queryByTestId('member_questions.view');
    expect(component).toBeDefined();

    const inputComp = wrapper.queryAllByTestId('member_questions.answer');
    expect(inputComp).toBeDefined();
    expect(inputComp.length).toEqual(MEMBERSHIP_QUESITONS.length);
    fireEvent.changeText(inputComp[0], 'test');

    act(() => {
      useMemberQuestionsStore.setState((state) => {
        state.answers[MEMBERSHIP_QUESITONS[0].id] = {
          questionId: MEMBERSHIP_QUESITONS[0].id,
          answer: 'test',
        };
        return state;
      });
    });

    const buttonSubmit = wrapper.getByTestId('member_questions.sumbit');
    expect(buttonSubmit).toBeDefined();
    fireEvent.press(buttonSubmit);
    expect(joinCommunity).toBeCalled();
  });

  it('close modal and call open terms when isActiveGroupTerms = true ', () => {
    const newIds = MEMBERSHIP_QUESITONS.map((item) => item.id);
    const newItems = MEMBERSHIP_QUESITONS.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    const response = { data: MEMBERSHIP_QUESITONS };
    const spy = jest.spyOn(groupApi, 'getMembershipQuestions')
      .mockImplementation(() => Promise.resolve(response) as any);

    const setTermInfo = jest.fn();
    useTermStore.setState((state) => {
      state.actions.setTermInfo = setTermInfo;
      return state;
    });

    const wrapper = renderWithRedux(<MemberQuestionsModal />);

    act(() => {
      useMemberQuestionsStore.setState((state) => {
        state.isActive = true;
        state.rootGroupId = 'test';
        state.type = 'community';
        state.ids = newIds;
        state.questions = newItems;
        state.answers = {};
        state.loading = false;
        state.isOpen = true;
        state.isActiveGroupTerms = true;
        return state;
      });
    });
    expect(spy).toBeCalled();
    const component = wrapper.queryByTestId('member_questions.view');
    expect(component).toBeDefined();

    const inputComp = wrapper.queryAllByTestId('member_questions.answer');
    expect(inputComp).toBeDefined();
    expect(inputComp.length).toEqual(MEMBERSHIP_QUESITONS.length);
    fireEvent.changeText(inputComp[0], 'test');

    act(() => {
      useMemberQuestionsStore.setState((state) => {
        state.answers[MEMBERSHIP_QUESITONS[0].id] = {
          questionId: MEMBERSHIP_QUESITONS[0].id,
          answer: 'test',
        };
        return state;
      });
    });

    const buttonSubmit = wrapper.getByTestId('member_questions.sumbit');
    expect(buttonSubmit).toBeDefined();
    fireEvent.press(buttonSubmit);
    expect(setTermInfo).toBeCalled();
  });

  it('renders correctly when show terms of group', () => {
    const newIds = MEMBERSHIP_QUESITONS.map((item) => item.id);
    const newItems = MEMBERSHIP_QUESITONS.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    const response = { data: MEMBERSHIP_QUESITONS };
    jest.spyOn(groupApi, 'getMembershipQuestions')
      .mockImplementation(() => Promise.resolve(response) as any);

    const joinNewGroup = jest.fn();
    useDiscoverGroupsStore.setState((state) => {
      state.actions.joinNewGroup = joinNewGroup;
      return state;
    });

    const wrapper = renderWithRedux(<MemberQuestionsModal />);

    act(() => {
      useMemberQuestionsStore.setState((state) => {
        state.isActive = true;
        state.rootGroupId = 'test';
        state.type = 'group';
        state.isOpen = true;
        state.ids = newIds;
        state.questions = newItems;
        state.loading = false;
        return state;
      });
    });

    const component = wrapper.queryByTestId('member_questions.view');
    expect(component).toBeDefined();

    const inputComp = wrapper.queryAllByTestId('member_questions.answer');
    expect(inputComp).toBeDefined();
    fireEvent.changeText(inputComp[0], 'test');

    act(() => {
      useMemberQuestionsStore.setState((state) => {
        state.answers[MEMBERSHIP_QUESITONS[0].id] = {
          questionId: MEMBERSHIP_QUESITONS[0].id,
          answer: 'test',
        };
        return state;
      });
    });

    const buttonSubmit = wrapper.queryByTestId('member_questions.sumbit');
    expect(buttonSubmit).toBeDefined();
    fireEvent.press(buttonSubmit);
    expect(joinNewGroup).toBeCalled();
  });

  it('renders correctly when isOpen = false', () => {
    useMemberQuestionsStore.setState((state) => {
      state.isOpen = false;
      return state;
    });

    const wrapper = renderWithRedux(<MemberQuestionsModal />);
    const component = wrapper.queryByTestId('member_questions.view');
    expect(component).toBeNull();
  });

  it('renders correctly when press back to close modal', () => {
    const response = { data: [] };
    jest.spyOn(groupApi, 'getMembershipQuestions')
      .mockImplementation(() => Promise.resolve(response) as any);

    const setIsOpen = jest.fn();

    useMemberQuestionsStore.setState((state) => {
      state.isActive = true;
      state.rootGroupId = 'test';
      state.type = 'community';
      state.isOpen = true;
      state.ids = [];
      state.questions = {};
      state.loading = false;
      state.actions.setIsOpen = setIsOpen;
      return state;
    });

    const wrapper = renderWithRedux(<MemberQuestionsModal />);
    const component = wrapper.queryByTestId('member_questions.view');
    expect(component).toBeDefined();

    const headerBackComp = wrapper.queryByTestId('header.back.button');
    expect(headerBackComp).toBeDefined();
    fireEvent.press(headerBackComp);
    expect(setIsOpen).toBeCalled();
  });
});
