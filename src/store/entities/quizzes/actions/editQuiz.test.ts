import { act, renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import useModalStore from '~/store/modal';
import { QuizStatus } from '~/interfaces/IQuiz';
import APIErrorCode from '~/constants/apiErrorCode';

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
      () => Promise.reject({
        code: APIErrorCode.Post.QUIZ_NO_CRUD_PERMISSION_AT_GROUP,
        meta: {
          errors: {
            groupsDenied: ['123', '456'],
          },
        },
      }) as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.editQuiz({
        quizId: '111',
        params: {
          status: QuizStatus.PUBLISHED,
        },
        audiences: [{
          id: '123',
          name: 'community fake 1',
        }],
      });
    });

    expect(spyApiRegenerateQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(useModalStore.getState().alert.visible).toBeTruthy();
    });
  });
});
