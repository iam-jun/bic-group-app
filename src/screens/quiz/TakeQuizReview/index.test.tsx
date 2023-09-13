import React from 'react';
import {
  renderWithRedux,
  renderHook,
  act,
  fireEvent,
} from '~/test/testUtils';
import TakeQuizReview from '.';
import { postWithQuiz, mockResultQuiz } from '~/test/mock_data/quiz';
import useTakeQuizStore, { ITakeQuizState } from '../TakeQuiz/store';
import usePostsStore from '~/store/entities/posts';
import MockedNavigator from '~/test/MockedNavigator';
import { IPost } from '~/interfaces/IPost';
import { IParticipantResult } from '~/interfaces/IQuiz';
import streamApi from '~/api/StreamApi';

const participantId = postWithQuiz.data.quizDoing.quizParticipantId;
const quizId = 'c14e8f68-2b33-4303-ab81-0f29bb3192ac';
const contentId = '54f4a2eb-034d-4e4e-8810-44744bffc87d';

const resultDoing = {
  ...mockResultQuiz.data,
  finishedAt: null,
  score: null,
};

describe('TakeQuizReview screen', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.participantResult[participantId] = {
        ...mockResultQuiz.data,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuizReview
            route={{
              params: {
                quizId,
                participantId,
                contentId,
              },
            }}
          />
        )}
      />,
    );

    const content = wrapper.getByTestId('take_quiz_review');

    expect(content).toBeDefined();
  });

  it('should call submit when pass button submit', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const spyUpdateAnswers = jest.spyOn(streamApi, 'updateAnwsers').mockImplementation(
      () => Promise.resolve({
        code: 'api.ok',
        meta: {
          message: 'OK',
        },
      }),
    );

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.takingQuiz[participantId] = {
        currentQuestionIndex: 0,
        userAnswers: mockResultQuiz.data.userAnswers,
      };
      state.participantResult[participantId] = {
        ...resultDoing,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuizReview
            route={{
              params: {
                quizId,
                participantId,
                contentId,
              },
            }}
          />
        )}
      />,
    );

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      return state;
    });

    const content = wrapper.getByTestId('take_quiz_review');
    const btnSubmit = wrapper.getByTestId('take_quiz_review.btn_submit');

    fireEvent.press(btnSubmit);

    expect(content).toBeDefined();
    expect(spyUpdateAnswers).toBeCalled();
  });
});
