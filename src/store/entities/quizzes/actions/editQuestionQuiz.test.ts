import { renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import {
  mockCreateQuestionQuizResponse,
  mockGenerateQuizResponse,
} from '~/test/mock_data/quiz';
import { IQuiz } from '~/interfaces/IQuiz';
import useModalStore from '~/store/modal';

describe('editQuestionQuiz', () => {
  it('should edit question quiz success', async () => {
    const mockQuiz = {
      ...mockGenerateQuizResponse.data,
      questions: [
        ...mockGenerateQuizResponse.data.questions,
        { ...mockCreateQuestionQuizResponse.data },
      ],
    };
    const mockEditQuestionQuizResponse = {
      ...mockCreateQuestionQuizResponse,
      data: {
        ...mockCreateQuestionQuizResponse.data,
        content: 'test',
      },
    };
    const spyApiEditQuestionQuiz = jest
      .spyOn(streamApi, 'editQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve(mockEditQuestionQuizResponse) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockQuiz as IQuiz);

    result.current.actions.editQuestionQuiz(
      mockQuiz.id,
      mockEditQuestionQuizResponse.data,
    );

    expect(spyApiEditQuestionQuiz).toBeCalled();

    await waitFor(() => {
      const lstQuestion = result.current.data[mockQuiz.id].questions.at(-1);
      expect(
        lstQuestion.content,
      ).toBe('test');
    });
  });

  it('should edit question quiz failed', async () => {
    const mockQuiz = {
      ...mockGenerateQuizResponse.data,
      questions: [
        ...mockGenerateQuizResponse.data.questions,
        { ...mockCreateQuestionQuizResponse.data },
      ],
    };
    const mockEditQuestionQuiz = {
      ...mockCreateQuestionQuizResponse.data,
      content: 'test',
    };

    const spyApiEditQuestionQuiz = jest
      .spyOn(streamApi, 'editQuestionQuiz')
      .mockImplementation(
        () => Promise.resolve({}) as any,
      );

    const { result } = renderHook(() => useQuizzesStore());

    result.current.actions.addOrUpdateQuiz(mockQuiz as IQuiz);

    result.current.actions.editQuestionQuiz(
      mockQuiz.id,
      mockEditQuestionQuiz,
    );

    expect(spyApiEditQuestionQuiz).toBeCalled();

    await waitFor(() => {
      expect(useModalStore.getState().toast).toBeDefined();
      const lstQuestion = result.current.data[mockQuiz.id].questions.at(-1);
      expect(
        lstQuestion.content,
      ).not.toBe('test');
    });
  });
});
