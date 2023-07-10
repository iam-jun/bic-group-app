import React from 'react';
import { postWithQuiz } from '~/test/mock_data/quiz';
import useDraftQuizStore, { IDraftQuizState } from './store';
import { IPost } from '~/interfaces/IPost';
import { renderWithRedux } from '~/test/testUtils';
import Quiz from '.';

describe('Quiz component', () => {
  it('render correctly', () => {
    useDraftQuizStore.setState((state: IDraftQuizState) => {
      state.draftQuiz.data = [postWithQuiz] as IPost[];
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<Quiz
      onScroll={onScroll}
    />);
    const contentView = rendered.getByTestId('quiz.list');

    expect(rendered.toJSON()).toMatchSnapshot();
    expect(contentView).toBeDefined();
  });

  it('should render empty view when draft quizzes are empty end cant load more', () => {
    useDraftQuizStore.setState((state: IDraftQuizState) => {
      state.draftQuiz.data = [] as IPost[];
      state.draftQuiz.hasNextPage = false;
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<Quiz
      onScroll={onScroll}
    />);

    const emptyView = rendered.getByTestId('draft_quiz.empty_view');
    expect(emptyView).toBeDefined();
  });
});
