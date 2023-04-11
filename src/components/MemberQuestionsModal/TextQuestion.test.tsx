/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';

import { renderWithRedux } from '~/test/testUtils';
import TextQuestion from './TextQuestion';
import { MEMBERSHIP_QUESITONS } from '~/test/mock_data/group';
import useMemberQuestionsStore from './store';

afterEach(cleanup);

describe('NotificationAvatar component', () => {
  it('should render null when actors is empty', () => {
    const newIds = MEMBERSHIP_QUESITONS.map((item) => item.id);
    const newItems = MEMBERSHIP_QUESITONS.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    useMemberQuestionsStore.setState((state) => {
      state.questions = newItems;
      state.ids = newIds;
      state.isOpen = true;
      state.loading = false;
      return state;
    });

    const wrapper = renderWithRedux(
      <TextQuestion
        questionId={MEMBERSHIP_QUESITONS[0].id}
      />,
    );

    const inputComp = wrapper.queryByTestId('member_questions.answer');
    expect(inputComp).toBeDefined();
    fireEvent.changeText(inputComp, 'test');

    const label = wrapper.queryByTestId('member_questions.question');
    expect(label).toBeDefined();
    expect(label.children?.[0]).toEqual(MEMBERSHIP_QUESITONS[0].question);
  });
});
