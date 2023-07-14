import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import {
  GenStatus, IQuiz,
} from '~/interfaces/IQuiz';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import { renderWithRedux } from '~/test/testUtils';
import ComposeQuiz from './index';
import useQuizzesStore from '~/store/entities/quizzes';
import useModalStore from '~/store/modal';

describe('ComposeQuiz', () => {
  it('should show empty quiz', async () => {
    jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
      () => Promise.reject() as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    renderWithRedux(<ComposeQuiz route={{ params: { quizId: mockGenerateQuizResponse.data.id } }} />);

    await waitFor(() => {
      expect(result.current.data[mockGenerateQuizResponse.data.id]).not.toBeDefined();
    });
  });

  it('should show generating quiz', async () => {
    const fakeQuizResponse = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        genStatus: GenStatus.PENDING,
      },
    };
    jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
      () => Promise.resolve(fakeQuizResponse) as any,
    );

    const wrapper = renderWithRedux(<ComposeQuiz route={{ params: { quizId: fakeQuizResponse.data.id } }} />);

    await waitFor(() => {
      expect(wrapper.getByTestId('generating_quiz')).toBeDefined();
      const btnBack = wrapper.getByTestId('header.back');
      fireEvent.press(btnBack);
      expect(useModalStore.getState().toast.content).toBeDefined();
    });
  });

  it('should show generating quiz failed', async () => {
    const fakeQuizResponse = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        genStatus: GenStatus.FAILED,
      },
    };
    jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
      () => Promise.resolve(fakeQuizResponse) as any,
    );
    const spyApiRegenerateQuiz = jest.spyOn(streamApi, 'regenerateQuiz').mockImplementation(
      () => Promise.resolve(fakeQuizResponse) as any,
    );

    const wrapper = renderWithRedux(<ComposeQuiz route={{ params: { quizId: fakeQuizResponse.data.id } }} />);

    await waitFor(() => {
      expect(wrapper.getByTestId('generating_quiz_failed')).toBeDefined();
      const btnRegenerateQuiz = wrapper.getByTestId('generating_quiz_failed.btn_regenerate');
      fireEvent.press(btnRegenerateQuiz);
      expect(spyApiRegenerateQuiz).toBeCalled();
    });
  });

  it('should show question', async () => {
    jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
      () => Promise.resolve(mockGenerateQuizResponse) as any,
    );

    const wrapper = renderWithRedux(<ComposeQuiz route={{ params: { quizId: mockGenerateQuizResponse.data.id } }} />);

    await waitFor(() => {
      expect(wrapper.queryAllByTestId('question_compose_quiz_', { exact: false }).length).toBe(mockGenerateQuizResponse.data.questions.length);
    });
  });
});
