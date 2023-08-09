import React from 'react';
import { act } from 'react-test-renderer';
import {
  fireEvent,
  renderWithRedux,
  waitFor,
} from '~/test/testUtils';
import TakePartInAQuiz from '.';
import { postWithQuiz } from '~/test/mock_data/quiz';
import { QuizPost } from '~/interfaces/IQuiz';
import useModalStore from '~/store/modal';
import AlertModal from '~/beinComponents/modals/AlertModal';

describe('TakePartInAQuiz', () => {
  it('should render correctly', () => {
    const { quiz } = postWithQuiz.data;

    const quizHighestScore = {
      quizParticipantId: '123',
      score: 80,
    };

    const wrapper = renderWithRedux(
      <TakePartInAQuiz
        quiz={quiz as QuizPost}
        contentId="123"
        quizHighestScore={quizHighestScore}
        actor={postWithQuiz.data.actor}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render PASS when quizHighestScore empty', () => {
    const { quiz } = postWithQuiz.data;

    const quizHighestScore = null;

    const wrapper = renderWithRedux(
      <TakePartInAQuiz
        quiz={quiz as QuizPost}
        contentId="123"
        quizHighestScore={quizHighestScore}
        actor={postWithQuiz.data.actor}
      />,
    );

    const viewPass = wrapper.queryByTestId('take_part_in_quiz.pass_view');

    expect(viewPass).toBeNull();
  });

  it('should render PASS when score = 100 empty', () => {
    const { quiz } = postWithQuiz.data;

    const quizHighestScore = {
      quizParticipantId: '123',
      score: 100,
    };

    const wrapper = renderWithRedux(
      <TakePartInAQuiz
        quiz={quiz as QuizPost}
        contentId="123"
        quizHighestScore={quizHighestScore}
        actor={postWithQuiz.data.actor}
      />,
    );

    const viewPass = wrapper.queryByTestId('take_part_in_quiz.pass_view');

    expect(viewPass).toBeDefined();
  });

  it('should show alert when press Quiz', () => {
    const { quiz } = postWithQuiz.data;

    const quizHighestScore = {
      quizParticipantId: '123',
      score: 60,
    };

    const wrapper = renderWithRedux(
      <TakePartInAQuiz
        quiz={quiz as QuizPost}
        contentId="123"
        quizHighestScore={quizHighestScore}
        actor={postWithQuiz.data.actor}
      />,
    );

    const content = wrapper.queryByTestId('take_part_in_quiz.content');

    fireEvent.press(content);
    expect(useModalStore.getState().alert.content).toBeDefined();
  });

  it('should navigate to TakeQuiz screen when press confirm on alert', async () => {
    const { quiz } = postWithQuiz.data;

    const quizHighestScore = {
      quizParticipantId: '123',
      score: 60,
    };

    const alertModal = renderWithRedux(<AlertModal />);
    const wrapper = renderWithRedux(
      <TakePartInAQuiz
        quiz={quiz as QuizPost}
        contentId="123"
        quizHighestScore={quizHighestScore}
        actor={postWithQuiz.data.actor}
      />,
    );

    const content = wrapper.queryByTestId('take_part_in_quiz.content');
    let btnConfirm = null;

    fireEvent.press(content);

    await waitFor(() => {
      btnConfirm = alertModal.getByTestId('alert_modal.confirm');
      expect(btnConfirm).toBeDefined();
    });

    act(() => {
      fireEvent.press(btnConfirm);
    });
    expect(useModalStore.getState().alert.content).toBeDefined();
  });
});
