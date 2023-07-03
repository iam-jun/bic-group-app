import { act, renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import { GenerateQuizParams } from '~/interfaces/IQuiz';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import useModalStore from '~/store/modal';

describe('generateQuiz', () => {
  it('should generate quiz success', async () => {
    const spyApiGenerateQuiz = jest.spyOn(streamApi, 'generateQuiz').mockImplementation(
      () => Promise.resolve(mockGenerateQuizResponse) as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      const paramsGenerateQuiz: GenerateQuizParams = {
        contentId: '2f1bb8bb-84ac-46ed-9a0e-c254487e3520',
        title: 'hu',
        description: '',
        numberOfAnswers: 4,
        numberOfQuestions: 10,
        isRandom: true,
        numberOfAnswersDisplay: 4,
        numberOfQuestionsDisplay: 10,
      };
      result.current.actions.generateQuiz(paramsGenerateQuiz);
    });

    expect(spyApiGenerateQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.data['2f1bb8bb-84ac-46ed-9a0e-c254487e3520']).toBeDefined();
    });
  });

  it('should generate quiz failed', async () => {
    const spyApiGenerateQuiz = jest.spyOn(streamApi, 'generateQuiz').mockImplementation(
      () => Promise.reject() as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      const paramsGenerateQuiz: GenerateQuizParams = {
        contentId: '2f1bb8bb-84ac-46ed-9a0e-c254487e3520',
        title: 'hu',
        description: '',
        numberOfAnswers: 4,
        numberOfQuestions: 10,
        isRandom: true,
        numberOfAnswersDisplay: 4,
        numberOfQuestionsDisplay: 10,
      };
      result.current.actions.generateQuiz(paramsGenerateQuiz);
    });

    expect(spyApiGenerateQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.data['2f1bb8bb-84ac-46ed-9a0e-c254487e3520']).not.toBeDefined();
      expect(result.current.isGenerating).toBeFalsy();
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
