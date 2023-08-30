import { renderHook, waitFor } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import useQuizzesStore from '~/store/entities/quizzes';
import { handleQuizNotificationSocket } from './helper';

describe('helper quiz', () => {
  describe('handleQuizNotificationSocket function', () => {
    it('should getQuizDetail & getPostDetail when user is waiting for generating quiz', async () => {
      const spyApiGetQuizDetail = jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
        () => Promise.resolve() as any,
      );
      const spyApiGetPostDetail = jest.spyOn(streamApi, 'getPostDetail').mockImplementation(
        () => Promise.resolve() as any,
      );

      const { result } = renderHook(() => useQuizzesStore());

      result.current.actions.setWaitingProcessingQuiz('123');

      const fakeMsg = {
        activities: [
          {
            quizInfo: {
              quizId: '123',
              contentId: '111',
            },
          },
        ],
      };

      handleQuizNotificationSocket(fakeMsg);

      await waitFor(() => {
        expect(spyApiGetQuizDetail).toBeCalled();
        expect(spyApiGetPostDetail).toBeCalled();
      });
    });
  });
});
