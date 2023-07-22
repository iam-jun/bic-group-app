import React from 'react';
import {
  act,
  fireEvent,
  renderHook,
  renderWithRedux,
  waitFor,
} from '~/test/testUtils';
import EntryQuiz from './EntryQuiz';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { mockGenerateQuizResponse, postWithQuiz } from '~/test/mock_data/quiz';
import { IPost } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';
import streamApi from '~/api/StreamApi';
import useQuizzesStore from '~/store/entities/quizzes';

describe('SubmitFormQuiz', () => {
  it('should render correctly', async () => {
    const { result } = renderHook(() => usePostsStore());
    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EntryQuiz
            route={{
              params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' },
            }}
          />
        )}
      />,
    );

    await waitFor(() => {
      wrapper.getByTestId('question_answer_section.question');
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should show alert when user press back', async () => {
    const { result } = renderHook(() => usePostsStore());
    await act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const wrapper = renderWithRedux(<MockedNavigator
      component={() => <EntryQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />}
    />);

    let inputQuestion;
    await waitFor(() => {
      inputQuestion = wrapper.getByTestId('question_answer_section.question');
    });

    await act(() => {
      fireEvent.changeText(inputQuestion, '11');
    });

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
  });

  it('should create quiz success', async () => {
    jest.spyOn(streamApi, 'generateQuiz').mockImplementation(
      () => Promise.resolve(mockGenerateQuizResponse) as any,
    );

    const { result: resultUseQuizzesStore } = renderHook(() => useQuizzesStore());

    const { result } = renderHook(() => usePostsStore());
    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const wrapper = renderWithRedux(<MockedNavigator
      component={() => <EntryQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />}
    />);

    await waitFor(() => {
      wrapper.getByTestId('question_answer_section.question');
    });

    const btnNext = wrapper.getByTestId('header.button');

    await waitFor(() => {
      expect(btnNext.props.disabled).toBeFalsy();
    });

    fireEvent.press(btnNext);

    await waitFor(() => {
      expect(resultUseQuizzesStore.current.data[mockGenerateQuizResponse.data.id]).toBeDefined();
    });
  });
});
