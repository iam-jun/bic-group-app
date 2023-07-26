import React from 'react';
import useQuizzesStore from '~/store/entities/quizzes';
import MockedNavigator from '~/test/MockedNavigator';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import {
  fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import PublishQuiz from './PublishQuiz';
import { IQuiz, QuizStatus } from '~/interfaces/IQuiz';
import streamApi from '~/api/StreamApi';

describe('PublishQuiz', () => {
  it('should render correctly', async () => {
    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PublishQuiz
            route={{
              params: { quizId: mockGenerateQuizResponse.data.id },
            }}
          />
        )}
      />,
    );

    await waitFor(() => {
      wrapper.getByTestId('title_description_section.title');
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should publish successfully', async () => {
    const fakePublishQuizSuccess = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        status: QuizStatus.PUBLISHED,
        title: 'test',
      },
    };
    const spyApiEditQuiz = jest
      .spyOn(streamApi, 'editQuiz')
      .mockImplementation(() => Promise.resolve(fakePublishQuizSuccess) as any);

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      mockGenerateQuizResponse.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PublishQuiz
            route={{
              params: { quizId: mockGenerateQuizResponse.data.id },
            }}
          />
        )}
      />,
    );

    let inputTitle;
    await waitFor(() => {
      inputTitle = wrapper.getByTestId('title_description_section.title');
    });

    fireEvent.changeText(inputTitle, 'test');

    const btnCreate = wrapper.getByTestId('header.button');
    await waitFor(() => {
      expect(btnCreate.props.disabled).toBeFalsy();
    });

    fireEvent.press(btnCreate);

    await waitFor(() => {
      const params = spyApiEditQuiz.mock.calls[0][1] || {};
      const { title, description, numberOfQuestionsDisplay } = params;

      expect(title).toBe('test');
      expect(description).toBe(null);
      expect(numberOfQuestionsDisplay).toBeUndefined();
    });

    await waitFor(() => {
      expect(result.current.data[mockGenerateQuizResponse.data.id].title).toBe('test');
      expect(result.current.data[mockGenerateQuizResponse.data.id].status).toBe(QuizStatus.PUBLISHED);
    });
  });

  it('should edit successfully', async () => {
    const fakeQuiz = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        status: QuizStatus.PUBLISHED,
        title: 'title1',
        numberOfQuestionsDisplay: 10,
      },
    };
    const fakeEditQuizSuccess = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        status: QuizStatus.PUBLISHED,
        title: 'test',
        numberOfQuestionsDisplay: 10,
      },
    };
    const spyApiEditQuiz = jest
      .spyOn(streamApi, 'editQuiz')
      .mockImplementation(() => Promise.resolve(fakeEditQuizSuccess) as any);

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(
      fakeQuiz.data as IQuiz,
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PublishQuiz
            route={{
              params: { quizId: mockGenerateQuizResponse.data.id },
            }}
          />
        )}
      />,
    );

    let inputTitle;
    await waitFor(() => {
      inputTitle = wrapper.getByTestId('title_description_section.title');
    });

    fireEvent.changeText(inputTitle, 'test');

    const btnSave = wrapper.getByTestId('header.button');
    await waitFor(() => {
      expect(btnSave.props.disabled).toBeFalsy();
    });

    fireEvent.press(btnSave);

    await waitFor(() => {
      const params = spyApiEditQuiz.mock.calls[0][1] || {};
      const { title, description, numberOfQuestionsDisplay } = params;

      expect(title).toBe('test');
      expect(description).toBe(null);
      expect(numberOfQuestionsDisplay).toBe(10);
    });

    await waitFor(() => {
      expect(result.current.data[mockGenerateQuizResponse.data.id].title).toBe('test');
    });
  });
});
