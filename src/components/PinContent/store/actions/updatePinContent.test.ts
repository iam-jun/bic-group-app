import streamApi from '~/api/StreamApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { act, renderHook, waitFor } from '~/test/testUtils';
import usePinContent from '../index';

describe('updatePinContent action', () => {
  it('should update pin/unpin success', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const spyApiUpdatePinContent = jest.spyOn(streamApi, 'updatePinContent').mockImplementation(
      () => Promise.resolve({}),
    );
    const { result } = renderHook(() => usePinContent((state) => state));

    act(() => {
      result.current.actions.updatePinContent({
        postId: '789', pinGroupIds: ['123'], unpinGroupIds: ['456'], onError, onSuccess,
      });
    });

    expect(spyApiUpdatePinContent).toBeCalled();

    await waitFor(() => {
      const { groupPinContent, isLoading } = result.current;
      expect(groupPinContent['123'].data.length).toBe(1);
      expect(groupPinContent['456']).toBeUndefined();
      expect(isLoading).toBeFalsy();
      expect(onSuccess).toBeCalled();
    });
  });

  it('should update pin/unpin failed', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const spyApiUpdatePinContent = jest.spyOn(streamApi, 'updatePinContent').mockImplementation(
      () => Promise.reject({ code: APIErrorCode.Post.CONTENT_NO_PIN_PERMISSION }),
    );
    const { result } = renderHook(() => usePinContent((state) => state));
    usePinContent.setState((state) => ({
      ...state,
      pinAudiences: {
        123: {
          group: { id: '123' },
          error: '',
        },
        456: {
          group: { id: '456' },
          error: '',
        },
      },
    }));

    act(() => {
      result.current.actions.updatePinContent({
        postId: '789', pinGroupIds: ['123'], unpinGroupIds: ['456'], onError, onSuccess,
      });
    });

    expect(spyApiUpdatePinContent).toBeCalled();

    await waitFor(() => {
      const { isLoading } = result.current;
      expect(isLoading).toBeFalsy();
      expect(onSuccess).not.toBeCalled();
      expect(onError).toBeCalled();
    });
  });
});
