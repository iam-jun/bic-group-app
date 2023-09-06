import { renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import {
  mockGenerateQuizResponse,
} from '~/test/mock_data/quiz';
import { IQuiz } from '~/interfaces/IQuiz';
import useModalStore from '~/store/modal';

describe('deleteQuestionQuiz', () => {
  it('should delete question quiz success', async () => {
    const spyApiDeleteQuestionQuiz = jest
      .spyOn(streamApi, 'deleteQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve({}) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    result.current.actions.deleteQuestionQuiz(
      mockGenerateQuizResponse.data.id,
      mockGenerateQuizResponse.data.questions[0].id,
    );

    expect(spyApiDeleteQuestionQuiz).toBeCalled();

    await waitFor(() => {
      expect(
        result.current.data[mockGenerateQuizResponse.data.id].questions.length,
      ).toBe(mockGenerateQuizResponse.data.questions.length - 1);
    });
  });

  it('should delete question quiz failed', async () => {
    const spyApiDeleteQuestionQuiz = jest
      .spyOn(streamApi, 'deleteQuestionQuiz')
      .mockImplementation(
        () => Promise.reject({}) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    result.current.actions.deleteQuestionQuiz(
      mockGenerateQuizResponse.data.id,
      mockGenerateQuizResponse.data.questions[0].id,
    );

    expect(spyApiDeleteQuestionQuiz).toBeCalled();

    await waitFor(() => {
      expect(useModalStore.getState().toast).toBeDefined();
      expect(
        result.current.data[mockGenerateQuizResponse.data.id].questions.length,
      ).toBe(mockGenerateQuizResponse.data.questions.length);
    });
  });
});
