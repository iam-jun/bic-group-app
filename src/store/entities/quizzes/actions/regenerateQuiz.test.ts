import { act, renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import useModalStore from '~/store/modal';

describe('regenerateQuiz', () => {
  it('should regenerate quiz success', async () => {
    const spyApiRegenerateQuiz = jest.spyOn(streamApi, 'regenerateQuiz').mockImplementation(
      () => Promise.resolve(mockGenerateQuizResponse) as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.regenerateQuiz(mockGenerateQuizResponse.data.id);
    });

    expect(spyApiRegenerateQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.data[mockGenerateQuizResponse.data.id]).toBeDefined();
    });
  });

  it('should generate quiz failed', async () => {
    const spyApiRegenerateQuiz = jest.spyOn(streamApi, 'regenerateQuiz').mockImplementation(
      () => Promise.reject() as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.regenerateQuiz('123');
    });

    expect(spyApiRegenerateQuiz).toBeCalled();

    await waitFor(() => {
      expect(result.current.isGenerating).toBeFalsy();
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
