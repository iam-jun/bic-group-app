import React from 'react';
import {
  renderWithRedux,
  act,
} from '~/test/testUtils';
import Scoreboard from '.';
import useScoreboardStore, { IScoreboardState } from './store';
import MockedNavigator from '~/test/MockedNavigator';
import streamApi from '~/api/StreamApi';
import { mockResponseSummary, mockResponseUserParticipants } from '~/test/mock_data/quiz';
import { IUserParticipant } from '~/interfaces/IQuiz';

describe('Scoreboard screen', () => {
  it('should render correctly', () => {
    useScoreboardStore.setState((state: IScoreboardState) => {
      state.summaryDetail = mockResponseSummary.data;
      state.userParticipants.data = mockResponseUserParticipants.data.list as IUserParticipant[];
      state.userParticipants.hasNextPage = mockResponseUserParticipants.data.meta.hasNextPage;
      state.userParticipants.refreshing = false;
      state.userParticipants.loading = false;
      state.userParticipants.endCursor = mockResponseUserParticipants.data.meta.endCursor;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Scoreboard
            route={{
              params: {
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
              },
            }}
          />
        )}
      />,
    );

    const content = wrapper.getByTestId('score_board');
    expect(content).toBeDefined();
  });

  it('should call getQuizSummary', () => {
    const spyOnGetQuizSummary = jest.spyOn(streamApi, 'getQuizSummary').mockImplementation(
      () => Promise.resolve(mockResponseSummary),
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Scoreboard
            route={{
              params: {
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
              },
            }}
          />
        )}
      />,
    );

    const content = wrapper.getByTestId('score_board');

    expect(content).toBeDefined();
    expect(spyOnGetQuizSummary).toBeCalled();
  });

  it('should call getUsersParticipants', () => {
    jest.useFakeTimers();

    const spyOnGetUsersParticipants = jest.spyOn(streamApi, 'getUsersParticipants').mockImplementation(
      () => Promise.resolve(mockResponseUserParticipants),
    );

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <Scoreboard
            route={{
              params: {
                contentId: '54f4a2eb-034d-4e4e-8810-44744bffc87d',
              },
            }}
          />
        )}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });
    jest.useRealTimers();

    const content = wrapper.getByTestId('score_board');

    expect(content).toBeDefined();
    expect(spyOnGetUsersParticipants).toBeCalled();
  });
});
