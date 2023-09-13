import { act, renderHook, waitFor } from '@testing-library/react-native';
import useQuizzesStore from '../index';
import streamApi from '~/api/StreamApi';
import { mockGenerateQuizResponse } from '~/test/mock_data/quiz';
import useModalStore from '~/store/modal';

describe('getQuizDetail', () => {
  it('should getQuizDetail success', async () => {
    const spyApiGetQuizDetail = jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
      () => Promise.resolve(mockGenerateQuizResponse) as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.getQuizDetail({ quizId: mockGenerateQuizResponse.data.id });
    });

    expect(spyApiGetQuizDetail).toBeCalled();

    await waitFor(() => {
      expect(result.current.data[mockGenerateQuizResponse.data.id]).toBeDefined();
    });
  });

  it('should getQuizDetail failed', async () => {
    const spyApiGetQuizDetail = jest.spyOn(streamApi, 'getQuizDetail').mockImplementation(
      () => Promise.resolve() as any,
    );

    const { result } = renderHook(() => useQuizzesStore());

    act(() => {
      result.current.actions.getQuizDetail({ quizId: mockGenerateQuizResponse.data.id });
    });

    expect(spyApiGetQuizDetail).toBeCalled();

    await waitFor(() => {
      expect(result.current.isGettingQuizDetail).toBeFalsy();
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
