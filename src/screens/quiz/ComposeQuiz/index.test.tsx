/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import { GenerateQuizParams, QuizStatus } from '~/interfaces/IQuiz';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import { renderWithRedux } from '~/test/testUtils';
import ComposeQuiz from './index';
import useQuizzesStore from '~/store/entities/quizzes';

describe('ComposeQuiz', () => {
  // it('should generate quiz success', async () => {
  //   jest.spyOn(streamApi, 'generateQuiz').mockImplementation(
  //     () => Promise.resolve(mockGenerateQuizResponse) as any,
  //   );

  //   const { result } = renderHook(() => useQuizzesStore());

  //   const paramsGenerateQuiz: GenerateQuizParams = {
  //     contentId: '2f1bb8bb-84ac-46ed-9a0e-c254487e3520',
  //     title: 'hu',
  //     description: '',
  //     numberOfAnswers: 4,
  //     numberOfQuestions: 10,
  //     isRandom: true,
  //     numberOfAnswersDisplay: 4,
  //     numberOfQuestionsDisplay: 10,
  //   };

  //   const wrapper = renderWithRedux(<ComposeQuiz route={{ params: paramsGenerateQuiz }} />);

  //   await waitFor(() => {
  //     expect(result.current.data['2f1bb8bb-84ac-46ed-9a0e-c254487e3520']).toBeDefined();
  //   });

  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('should save quiz success', async () => {
  //   jest.spyOn(streamApi, 'generateQuiz').mockImplementation(
  //     () => Promise.resolve(mockGenerateQuizResponse) as any,
  //   );
  //   const mockPublishResponse = {
  //     ...mockGenerateQuizResponse,
  //     data: {
  //       ...mockGenerateQuizResponse.data,
  //       status: QuizStatus.PUBLISHED,
  //     },
  //   };
  //   jest.spyOn(streamApi, 'editQuiz').mockImplementation(
  //     () => Promise.resolve(mockPublishResponse) as any,
  //   );
  //   jest
  //     .spyOn(streamApi, 'getPostDetail')
  //     .mockImplementation(() => Promise.resolve());

  //   const { result } = renderHook(() => useQuizzesStore());

  //   const paramsGenerateQuiz: GenerateQuizParams = {
  //     contentId: '2f1bb8bb-84ac-46ed-9a0e-c254487e3520',
  //     title: 'hu',
  //     description: '',
  //     numberOfAnswers: 4,
  //     numberOfQuestions: 10,
  //     isRandom: true,
  //     numberOfAnswersDisplay: 4,
  //     numberOfQuestionsDisplay: 10,
  //   };

  //   const wrapper = renderWithRedux(<ComposeQuiz route={{ params: paramsGenerateQuiz }} />);

  //   await waitFor(() => {
  //     expect(result.current.data['2f1bb8bb-84ac-46ed-9a0e-c254487e3520']).toBeDefined();
  //   });

  //   const btnSave = wrapper.getByTestId('header.button');

  //   fireEvent.press(btnSave);

  //   await waitFor(() => {
  //     expect(result.current.data['2f1bb8bb-84ac-46ed-9a0e-c254487e3520'].status).toBe(QuizStatus.PUBLISHED);
  //   });
  // });
});
