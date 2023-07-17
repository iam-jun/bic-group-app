import React from 'react';
import {
  act, fireEvent, renderHook, waitFor,
} from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import { AnswerItem, IQuiz } from '~/interfaces/IQuiz';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import { renderWithRedux } from '~/test/testUtils';
import useQuizzesStore from '~/store/entities/quizzes';
import useModalStore from '~/store/modal';
import EditQuestion from './index';
import AlertModal from '~/beinComponents/modals/AlertModal';
import MockedNavigator from '~/test/MockedNavigator';

describe('EditQuestion', () => {
  it('should remove question', async () => {
    const spyApiEditQuiz = jest
      .spyOn(streamApi, 'editQuiz')
      .mockImplementation(() => Promise.resolve() as any);

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator component={() => (
        <>
          <EditQuestion
            route={{
              params: {
                quizId: mockGenerateQuizResponse.data.id,
                questionIndex: 0,
              },
            }}
          />
          <AlertModal />
        </>
      )}
      />,
    );

    const btnRemoveQuestion = wrapper.getByTestId('question_field.btn_remove');
    fireEvent.press(btnRemoveQuestion);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
    const btnConfirm = wrapper.getByTestId('alert_modal.confirm');
    fireEvent.press(btnConfirm);

    await waitFor(() => {
      const params = spyApiEditQuiz.mock.calls[0][1] || {};
      const { questions = [] } = params;

      expect(questions.length).toBe(
        mockGenerateQuizResponse.data.questions.length - 1,
      );
    });
  });

  it('should remove answer', async () => {
    const fakeEditQuizResponse = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        questions: [
          {
            ...mockGenerateQuizResponse.data.questions[0],
            answers: mockGenerateQuizResponse.data.questions[0].answers.slice(1),
          },
          ...mockGenerateQuizResponse.data.questions.slice(1),
        ],
      },
    };
    const spyApiEditQuiz = jest
      .spyOn(streamApi, 'editQuiz')
      .mockImplementation(() => Promise.resolve(fakeEditQuizResponse) as any);

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator component={() => (
        <EditQuestion
          route={{
            params: {
              quizId: mockGenerateQuizResponse.data.id,
              questionIndex: 0,
            },
          }}
        />
      )}
      />,
    );

    let btnRemoveAnswer;
    await waitFor(() => {
      btnRemoveAnswer = wrapper.getByTestId('answer_field.btn_remove_0');
    });

    await act(() => {
      fireEvent.press(btnRemoveAnswer);
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      const params = spyApiEditQuiz.mock.calls[0][1] || {};
      const { questions = [] } = params;
      const { answers = [] } = questions[0] || {};

      expect(answers.length).toBe(
        mockGenerateQuizResponse.data.questions[0].answers.length - 1,
      );
    });

    await waitFor(() => {
      expect(result.current.data[mockGenerateQuizResponse.data.id].questions[0].answers.length).toBe(
        mockGenerateQuizResponse.data.questions[0].answers.length - 1,
      );
    });
  });

  it('should set correct answer', async () => {
    const spyApiEditQuiz = jest
      .spyOn(streamApi, 'editQuiz')
      .mockImplementation(() => Promise.resolve() as any);

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator component={() => (
        <EditQuestion
          route={{
            params: {
              quizId: mockGenerateQuizResponse.data.id,
              questionIndex: 0,
            },
          }}
        />
      )}
      />,
    );

    let btnCheckAnswer;
    await waitFor(() => {
      btnCheckAnswer = wrapper.getByTestId('answer_field.btn_check_0');
    });

    await act(() => {
      fireEvent.press(btnCheckAnswer);
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      const params = spyApiEditQuiz.mock.calls[0][1] || {};
      const { questions = [] } = params;
      const { answers = [] } = questions[0] || {};
      const firstAnswer = answers[0] || {} as AnswerItem;
      const { isCorrect } = firstAnswer;

      expect(isCorrect).toBeTruthy();
    });
  });

  it('should show alert when press back', async () => {
    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator component={() => (
        <EditQuestion
          route={{
            params: {
              quizId: mockGenerateQuizResponse.data.id,
              questionIndex: 0,
            },
          }}
        />
      )}
      />,
    );

    let btnRemoveAnswer;
    await waitFor(() => {
      btnRemoveAnswer = wrapper.getByTestId('answer_field.btn_remove_0');
    });

    await act(() => {
      fireEvent.press(btnRemoveAnswer);
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
    });

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
  });
});
