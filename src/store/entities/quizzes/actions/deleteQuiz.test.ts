import { act, renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import { QuizStatus } from '~/interfaces/IQuiz';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import useModalStore from '~/store/modal';

describe('deleteQuiz', () => {
  it('should delete quiz success', async () => {
    const mockPublishResponse = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        status: QuizStatus.PUBLISHED,
      },
    };
    const spyApiDeleteQuiz = jest.spyOn(streamApi, 'deleteQuiz').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockPublishResponse.data);

    act(() => {
      result.current.actions.deleteQuiz(mockPublishResponse.data.id, mockPublishResponse.data.contentId);
    });

    expect(spyApiDeleteQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.data[mockPublishResponse.data.id].deleted).toBeTruthy();
    });
  });

  it('should delete quiz failed', async () => {
    const mockPublishResponse = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        status: QuizStatus.PUBLISHED,
      },
    };
    const spyApiDeleteQuiz = jest.spyOn(streamApi, 'deleteQuiz').mockImplementation(
      () => Promise.reject() as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockPublishResponse.data);

    act(() => {
      result.current.actions.deleteQuiz(mockPublishResponse.data.id, mockPublishResponse.data.contentId);
    });

    expect(spyApiDeleteQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.data[mockPublishResponse.data.id]).toBeDefined();
      expect(result.current.loading).toBeFalsy();
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
