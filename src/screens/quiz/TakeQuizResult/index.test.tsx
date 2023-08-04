import React from 'react';
import {
  renderWithRedux,
  renderHook,
  act,
  fireEvent,
} from '~/test/testUtils';
import TakeQuizResult from '.';
import { postWithQuiz, mockResultQuiz } from '~/test/mock_data/quiz';
import useTakeQuizStore, { ITakeQuizState } from '../TakeQuiz/store';
import usePostsStore from '~/store/entities/posts';
import MockedNavigator from '~/test/MockedNavigator';
import { IPost } from '~/interfaces/IPost';
import { IParticipantResult } from '~/interfaces/IQuiz';
import * as navigationHook from '~/hooks/navigation';

const participantId = postWithQuiz.data.quizDoing.quizParticipantId;
const quizId = 'c14e8f68-2b33-4303-ab81-0f29bb3192ac';
const contentId = '54f4a2eb-034d-4e4e-8810-44744bffc87d';
const quizResult = {
  ...mockResultQuiz.data,
  score: 100,
};

describe('TakeQuizResult screen', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.participantResult[participantId] = {
        ...mockResultQuiz.data,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuizResult
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

    const content = wrapper.getByTestId('take_quiz_result');

    expect(content).toBeDefined();
  });

  it('should render congrat', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.participantResult[participantId] = {
        ...quizResult,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuizResult
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

    const content = wrapper.getByTestId('take_quiz_result.congrats');

    expect(content).toBeDefined();
  });

  it('should go to TakeQuiz when press retake button', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any)
    );

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.participantResult[participantId] = {
        ...quizResult,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuizResult
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

    const content = wrapper.getByTestId('take_quiz_result');
    const btnRetake = wrapper.getByTestId('take_quiz_result.btn_retake');
    
    fireEvent.press(btnRetake);

    expect(content).toBeDefined();
    expect(navigate).toBeCalled();
  });
});
