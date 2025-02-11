import streamApi from '~/api/StreamApi';
import { IParamsValidateSeriesTags } from '~/interfaces/IArticle';
import { act, renderHook, waitFor } from '~/test/testUtils';
import useValidateSeriesTagsStore from '../index';

describe('validateSeriesTags', () => {
  it('should validate series/tags success', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const spyApiValidateSeriesTags = jest.spyOn(streamApi, 'validateSeriesTags').mockImplementation(
      () => Promise.resolve() as any,
    );
    const { result } = renderHook(() => useValidateSeriesTagsStore((state) => state));

    act(() => {
      result.current.actions.validateSeriesTags({} as IParamsValidateSeriesTags, onSuccess, onError);
    });

    expect(spyApiValidateSeriesTags).toBeCalled();

    await waitFor(() => {
      expect(result.current.isValidating).toBeFalsy();
      expect(onSuccess).toBeCalled();
    });
  });

  it('should validate series/tags error', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const spyApiValidateSeriesTags = jest.spyOn(streamApi, 'validateSeriesTags').mockImplementation(
      () => Promise.reject() as any,
    );
    const { result } = renderHook(() => useValidateSeriesTagsStore((state) => state));

    act(() => {
      result.current.actions.validateSeriesTags({} as IParamsValidateSeriesTags, onSuccess, onError);
    });

    expect(spyApiValidateSeriesTags).toBeCalled();

    await waitFor(() => {
      expect(result.current.isValidating).toBeFalsy();
      expect(onError).toBeCalled();
    });
  });
});
