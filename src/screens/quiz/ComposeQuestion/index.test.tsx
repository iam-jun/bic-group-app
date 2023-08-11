import React from 'react';
import {
  act,
  fireEvent,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import { IQuiz } from '~/interfaces/IQuiz';
import {
  mockCreateQuestionQuizResponse,
  mockGenerateQuizResponse,
} from '~/test/mock_data/quiz';
import { renderWithRedux } from '~/test/testUtils';
import useQuizzesStore from '~/store/entities/quizzes';
import useModalStore from '~/store/modal';
import ComposeQuestion from './index';
import AlertModal from '~/beinComponents/modals/AlertModal';
import MockedNavigator from '~/test/MockedNavigator';
import * as navigationHook from '~/hooks/navigation';

describe('EditQuestion', () => {
  it('should remove editing question', async () => {
    const spyApiDeleteQuestionQuiz = jest
      .spyOn(streamApi, 'deleteQuestionQuiz')
      .mockImplementation(() => Promise.resolve({}) as any);

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <>
            <ComposeQuestion
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

    expect(spyApiDeleteQuestionQuiz).toBeCalled();

    await waitFor(() => {
      expect(
        result.current.data[mockGenerateQuizResponse.data.id].questions.length,
      ).toBe(mockGenerateQuizResponse.data.questions.length - 1);
    });
  });

  it('should remove creating question', async () => {
    const goBack = jest.fn();
    const rootNavigation = { goBack };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <>
            <ComposeQuestion
              route={{
                params: {
                  quizId: mockGenerateQuizResponse.data.id,
                },
              }}
            />
            <AlertModal />
          </>
        )}
      />,
    );

    let inputQuestion;
    await waitFor(() => {
      inputQuestion = wrapper.getByTestId('question_field.question');
    });

    await act(() => {
      fireEvent.changeText(inputQuestion, 'abc');
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
    });

    const btnRemoveQuestion = wrapper.getByTestId('question_field.btn_remove');
    fireEvent.press(btnRemoveQuestion);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
    const btnConfirm = wrapper.getByTestId('alert_modal.confirm');
    fireEvent.press(btnConfirm);

    await waitFor(() => {
      expect(goBack).toBeCalled();
    });
  });

  it('should remove answer', async () => {
    const mockQuiz = {
      ...mockGenerateQuizResponse.data,
      questions: [
        ...mockGenerateQuizResponse.data.questions,
        { ...mockCreateQuestionQuizResponse.data },
      ],
    };
    const mockEditQuestionQuizResponse = {
      ...mockCreateQuestionQuizResponse,
      data: {
        ...mockCreateQuestionQuizResponse.data,
        answers: [...mockCreateQuestionQuizResponse.data.answers.slice(1)],
      },
    };
    jest
      .spyOn(streamApi, 'editQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve(mockEditQuestionQuizResponse) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockQuiz as IQuiz);

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ComposeQuestion
            route={{
              params: {
                quizId: mockQuiz.id,
                questionIndex: mockQuiz.questions.length - 1,
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
      expect(
        result.current.data[mockQuiz.id].questions.at(-1).answers.length,
      ).toBe(mockEditQuestionQuizResponse.data.answers.length);
    });
  });

  it('should add answer', async () => {
    const mockQuiz = {
      ...mockGenerateQuizResponse.data,
      questions: [
        ...mockGenerateQuizResponse.data.questions,
        { ...mockCreateQuestionQuizResponse.data },
      ],
    };
    const mockEditQuestionQuizResponse = {
      ...mockCreateQuestionQuizResponse,
      data: {
        ...mockCreateQuestionQuizResponse.data,
        answers: [...mockCreateQuestionQuizResponse.data.answers, {
          id: '123',
          content: 'test',
          isCorrect: false,
        }],
      },
    };
    jest
      .spyOn(streamApi, 'editQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve(mockEditQuestionQuizResponse) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockQuiz as IQuiz);

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ComposeQuestion
            route={{
              params: {
                quizId: mockQuiz.id,
                questionIndex: mockQuiz.questions.length - 1,
              },
            }}
          />
        )}
      />,
    );

    let btnAddAnswer;
    await waitFor(() => {
      btnAddAnswer = wrapper.getByTestId('compose_question.add_answer');
    });

    await act(() => {
      fireEvent.press(btnAddAnswer);
    });

    let inputAnswer;
    await waitFor(() => {
      inputAnswer = wrapper.queryAllByTestId('answer_field.answer')[mockCreateQuestionQuizResponse.data.answers.length];
    });

    await act(() => {
      fireEvent.changeText(inputAnswer, 'test');
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      expect(
        result.current.data[mockQuiz.id].questions.at(-1).answers.length,
      ).toBe(mockEditQuestionQuizResponse.data.answers.length);
      expect(
        result.current.data[mockQuiz.id].questions.at(-1).answers.at(-1).content,
      ).toBe('test');
    });
  });

  it('should set correct answer', async () => {
    const mockQuiz = {
      ...mockGenerateQuizResponse.data,
      questions: [
        ...mockGenerateQuizResponse.data.questions,
        { ...mockCreateQuestionQuizResponse.data },
      ],
    };
    const mockEditQuestionQuizResponse = {
      ...mockCreateQuestionQuizResponse,
      data: {
        ...mockCreateQuestionQuizResponse.data,
        answers: [
          ...mockCreateQuestionQuizResponse.data.answers.map((ans, index) => (index === 0
            ? { ...ans, isCorrect: true }
            : { ...ans, isCorrect: false })),
        ],
      },
    };
    jest
      .spyOn(streamApi, 'editQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve(mockEditQuestionQuizResponse) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockQuiz as IQuiz);

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ComposeQuestion
            route={{
              params: {
                quizId: mockGenerateQuizResponse.data.id,
                questionIndex: mockQuiz.questions.length - 1,
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
      expect(
        result.current.data[mockQuiz.id].questions.at(-1).answers[0].isCorrect,
      ).toBeTruthy();
    });
  });

  it('should show alert when press back', async () => {
    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator component={() => (
        <ComposeQuestion
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

  it('should create question success', async () => {
    jest
      .spyOn(streamApi, 'createQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve(mockCreateQuestionQuizResponse) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ComposeQuestion
            route={{
              params: {
                quizId: mockGenerateQuizResponse.data.id,
              },
            }}
          />
        )}
      />,
    );

    let inputQuestion;
    await waitFor(() => {
      inputQuestion = wrapper.getByTestId('question_field.question');
    });

    await act(() => {
      fireEvent.changeText(inputQuestion, mockCreateQuestionQuizResponse.data.content);
    });

    const inputsAnswer = wrapper.queryAllByTestId('answer_field.answer');

    await act(() => {
      fireEvent.changeText(inputsAnswer[0], mockCreateQuestionQuizResponse.data.answers[0].content);
      fireEvent.changeText(inputsAnswer[1], mockCreateQuestionQuizResponse.data.answers[1].content);
    });

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
      expect(
        result.current.data[mockGenerateQuizResponse.data.id].questions.length,
      ).toBe(mockGenerateQuizResponse.data.questions.length + 1);
    });
  });

  it('should show error need to choose correct answer', async () => {
    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ComposeQuestion
            route={{
              params: {
                quizId: mockGenerateQuizResponse.data.id,
              },
            }}
          />
        )}
      />,
    );

    let inputQuestion;
    await waitFor(() => {
      inputQuestion = wrapper.getByTestId('question_field.question');
    });

    await act(() => {
      fireEvent.changeText(inputQuestion, '123');
    });

    const inputsAnswer = wrapper.queryAllByTestId('answer_field.answer');

    await act(() => {
      fireEvent.changeText(inputsAnswer[0], 'answ1');
      fireEvent.changeText(inputsAnswer[1], 'answ2');
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      const error = wrapper.getByTestId('compose_question.error_choose_correct_answer');
      expect(error).toBeDefined();
    });
  });

  it('should show error input question if it is empty', async () => {
    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ComposeQuestion
            route={{
              params: {
                quizId: mockGenerateQuizResponse.data.id,
              },
            }}
          />
        )}
      />,
    );

    let inputsAnswer;
    await waitFor(() => {
      inputsAnswer = wrapper.queryAllByTestId('answer_field.answer');
    });

    await act(() => {
      fireEvent.changeText(inputsAnswer[0], 'answ1');
      fireEvent.changeText(inputsAnswer[1], 'answ2');
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      const error = wrapper.getByTestId('textarea_error');
      expect(error.children[0]).toBe('This field must not be empty');
    });
  });

  it('should show error input answer if it is empty', async () => {
    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ComposeQuestion
            route={{
              params: {
                quizId: mockGenerateQuizResponse.data.id,
              },
            }}
          />
        )}
      />,
    );

    let inputQuestion;
    await waitFor(() => {
      inputQuestion = wrapper.getByTestId('question_field.question');
    });

    await act(() => {
      fireEvent.changeText(inputQuestion, 'abc');
    });

    let inputsAnswer;
    await waitFor(() => {
      inputsAnswer = wrapper.queryAllByTestId('answer_field.answer');
    });

    await act(() => {
      fireEvent.changeText(inputsAnswer[0], '');
      fireEvent.changeText(inputsAnswer[1], '');
    });

    const btnSave = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      const errors = wrapper.queryAllByTestId('textarea_error');
      expect(errors.length).toBe(2);
    });
  });
});
