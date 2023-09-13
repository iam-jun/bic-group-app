import { act, renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import { QuizStatus } from '~/interfaces/IQuiz';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';

describe('deleteQuizLocal', () => {
  it('should warning if quizId is missing', async () => {
    const spyConsoleWarn = jest.spyOn(console, 'warn');

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.deleteQuizLocal('');
    });

    expect(spyConsoleWarn).toBeCalled();
  });

  it('should delete quiz local success', async () => {
    const mockPublishResponse = {
      ...mockGenerateQuizResponse,
      data: {
        ...mockGenerateQuizResponse.data,
        status: QuizStatus.PUBLISHED,
      },
    };

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockPublishResponse.data);

    act(() => {
      result.current.actions.deleteQuizLocal(mockPublishResponse.data.id);
    });

    await waitFor(() => {
      expect(result.current.data[mockPublishResponse.data.id].deleted).toBeTruthy();
    });
  });
});
