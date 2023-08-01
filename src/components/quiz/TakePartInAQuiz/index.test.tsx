import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import TakePartInAQuiz from '.';
import { postWithQuiz } from '~/test/mock_data/quiz';
import { QuizPost } from '~/interfaces/IQuiz';

describe('TakePartInAQuiz', () => {
  it('should render correctly', () => {
    const { quiz } = postWithQuiz.data;

    const wrapper = renderWithRedux(<TakePartInAQuiz quiz={quiz as QuizPost} contentId='123' />);

    expect(wrapper).toMatchSnapshot();
  });
});
