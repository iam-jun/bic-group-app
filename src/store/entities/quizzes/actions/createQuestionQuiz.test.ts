import { renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import {
  mockCreateQuestionQuizResponse,
  mockGenerateQuizResponse,
} from '~/test/mock_data/quiz';
import { IQuiz } from '~/interfaces/IQuiz';
import useModalStore from '~/store/modal';

describe('createQuestionQuiz', () => {
  it('should create question quiz success', async () => {
    const mockQuestion = {
      content: 'r',
      answers: [
        {
          content: 'c',
          isCorrect: false,
        },
        {
          content: 'v',
          isCorrect: true,
        },
      ],
    };
    const spyApiCreateQuestionQuiz = jest
      .spyOn(streamApi, 'createQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve(mockCreateQuestionQuizResponse) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    result.current.actions.createQuestionQuiz(
      mockGenerateQuizResponse.data.id,
      mockQuestion,
    );

    expect(spyApiCreateQuestionQuiz).toBeCalled();

    await waitFor(() => {
      expect(
        result.current.data[mockGenerateQuizResponse.data.id],
      ).toBeDefined();
      expect(
        result.current.data[mockGenerateQuizResponse.data.id].questions.length,
      ).toBe(mockGenerateQuizResponse.data.questions.length + 1);
    });
  });

  it('should create question quiz failed', async () => {
    const mockQuestion = {
      content: 'r',
      answers: [
        {
          content: 'c',
          isCorrect: false,
        },
        {
          content: 'v',
          isCorrect: true,
        },
      ],
    };
    const spyApiCreateQuestionQuiz = jest
      .spyOn(streamApi, 'createQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve({}) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockGenerateQuizResponse.data as IQuiz);

    result.current.actions.createQuestionQuiz(
      '123',
      mockQuestion,
    );

    expect(spyApiCreateQuestionQuiz).toBeCalled();

    await waitFor(() => {
      expect(useModalStore.getState().toast).toBeDefined();
      expect(
        result.current.data[mockGenerateQuizResponse.data.id].questions.length,
      ).toBe(mockGenerateQuizResponse.data.questions.length);
    });
  });
});
