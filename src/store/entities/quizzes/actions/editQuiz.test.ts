import { act, renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import useModalStore from '~/store/modal';
import { QuizStatus } from '~/interfaces/IQuiz';

describe('editQuiz', () => {
  it('should publish quiz success', async () => {
    const mockPublishResponse = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        status: QuizStatus.PUBLISHED,
      },
    };
    const spyApiEditQuiz = jest.spyOn(streamApi, 'editQuiz').mockImplementation(
      () => Promise.resolve(mockPublishResponse) as any,
    );
    jest
      .spyOn(streamApi, 'getPostDetail')
      .mockImplementation(() => Promise.resolve());

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.editQuiz({
        quizId: mockPublishResponse.data.id,
        params: {
          status: QuizStatus.PUBLISHED,
        },
      });
    });

    expect(spyApiEditQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.data[mockPublishResponse.data.id].status).toBe(QuizStatus.PUBLISHED);
    });
  });

  it('should generate quiz failed show alert', async () => {
    const spyApiRegenerateQuiz = jest.spyOn(streamApi, 'editQuiz').mockImplementation(
      () => Promise.reject({}) as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.editQuiz({
        quizId: '111',
        params: {
          status: QuizStatus.PUBLISHED,
        },
      });
    });

    expect(spyApiRegenerateQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
