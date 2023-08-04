import React from 'react';
import {
  renderWithRedux,
  renderHook,
  act,
  fireEvent,
} from '~/test/testUtils';
import TakeQuiz from '.';
import { postWithQuiz, mockResultQuiz } from '~/test/mock_data/quiz';
import useTakeQuizStore, { ITakeQuizState } from './store';
import usePostsStore from '~/store/entities/posts';
import MockedNavigator from '~/test/MockedNavigator';
import { IPost } from '~/interfaces/IPost';
import { IParticipantResult } from '~/interfaces/IQuiz';
import streamApi from '~/api/StreamApi';
import * as navigationHook from '~/hooks/navigation';

const participantId = postWithQuiz.data.quizDoing.quizParticipantId;

const resultDoing = {
  ...mockResultQuiz.data,
  finishedAt: null,
};

describe('TakeQuiz screen', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.takingQuiz[participantId] = {
        currentQuestionIndex: 0,
        userAnswers: mockResultQuiz.data.userAnswers,
      }
      state.participantResult[participantId] = {
        ...mockResultQuiz.data,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
              },
            }}
          />
        )}
      />,
    );

    const content = wrapper.getByTestId('take_quiz');

    expect(content).toBeDefined();
  });

  it('should call getQuizParticipant', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    const spygetQuizParticipant = jest.spyOn(streamApi, 'getQuizParticipant').mockImplementation(
      () => Promise.resolve(mockResultQuiz)
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
              },
            }}
          />
        )}
      />,
    );

    const content = wrapper.getByTestId('take_quiz');

    expect(content).toBeDefined();
    expect(spygetQuizParticipant).toBeCalled();
  });

  it('should call startQuiz when currentParticipantId = null', () => {
    const spyStartQuiz = jest.spyOn(streamApi, 'startQuiz').mockImplementation(
      () => Promise.resolve({})
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
              },
            }}
          />
        )}
      />,
    );

    const content = wrapper.getByTestId('take_quiz');

    expect(content).toBeDefined();
    expect(spyStartQuiz).toBeCalled();
  });

  it('should next to question when press button next', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.takingQuiz[participantId] = {
        currentQuestionIndex: 0,
        userAnswers: mockResultQuiz.data.userAnswers,
      }
      state.participantResult[participantId] = {
        ...mockResultQuiz.data,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
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
    const btnNext = wrapper.queryByTestId('take_quiz.btn_next');

    fireEvent.press(btnNext);
    expect(
      useTakeQuizStore.getState().takingQuiz[participantId].currentQuestionIndex
    ).toEqual(1);
  });

  it('should previous to question when press button previous', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.takingQuiz[participantId] = {
        currentQuestionIndex: 1,
        userAnswers: mockResultQuiz.data.userAnswers,
      }
      state.participantResult[participantId] = {
        ...mockResultQuiz.data,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
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
    const btnPrev = wrapper.queryByTestId('take_quiz.btn_previous');

    fireEvent.press(btnPrev);
    expect(
      useTakeQuizStore.getState().takingQuiz[participantId].currentQuestionIndex
    ).toEqual(0);
  });

  it('should go to Review Screen when press button next last question', () => {
    const { result } = renderHook(() => usePostsStore());
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(
      () => ({ rootNavigation } as any)
    );

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.takingQuiz[participantId] = {
        currentQuestionIndex: 2,
        userAnswers: mockResultQuiz.data.userAnswers,
      }
      state.participantResult[participantId] = {
        ...mockResultQuiz.data,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
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
    const btnNext = wrapper.queryByTestId('take_quiz.btn_next');

    fireEvent.press(btnNext);
    expect(navigate).toBeCalled();
  });

  it('should choosed answer when press answer item', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.takingQuiz[participantId] = {
        currentQuestionIndex: 0,
        userAnswers: [],
      }
      state.participantResult[participantId] = {
        ...mockResultQuiz.data,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
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

    const answerItem = wrapper.getByTestId('answer_item.btn_answer_0');

    fireEvent.press(answerItem);
    expect(
      useTakeQuizStore.getState().takingQuiz[participantId].userAnswers.length
    ).toEqual(1);
  });

  it('should re-choosed answer when press answer item', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    });

    useTakeQuizStore.setState((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.takingQuiz[participantId] = {
        currentQuestionIndex: 0,
        userAnswers: mockResultQuiz.data.userAnswers,
      }
      state.participantResult[participantId] = {
        ...resultDoing,
      } as IParticipantResult;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <TakeQuiz
            route={{
              params: {
                quizId: 'c14e8f68-2b33-4303-ab81-0f29bb3192ac',
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
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

    const answerItem = wrapper.getByTestId('answer_item.btn_answer_0');

    fireEvent.press(answerItem);
    expect(
      useTakeQuizStore.getState().takingQuiz[participantId].userAnswers.length
    ).toEqual(3);
  });
});
