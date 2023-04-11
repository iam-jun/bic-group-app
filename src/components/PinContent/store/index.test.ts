import { isEmpty, isEqual } from 'lodash';
import streamApi from '~/api/StreamApi';
import { pinnableAudiencesResponse } from '~/test/mock_data/pinContent';
import { act, renderHook, waitFor } from '~/test/testUtils';
import usePinContentStore, { PinAudiences } from './index';

describe('usePinContentStore hook', () => {
  it('should update updatePinAudiences success', async () => {
    const { result } = renderHook(() => usePinContentStore((state) => state));

    const pinAudiences = pinnableAudiencesResponse.data.groups.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: {
          group: cur,
          error: '',
        },
      }),
      {} as PinAudiences,
    );

    act(() => {
      result.current.actions.updatePinAudiences(pinAudiences);
    });

    await waitFor(() => {
      expect(isEqual(result.current.pinAudiences, pinAudiences)).toBeTruthy();
    });
  });

  it('should resetPinAudiences success', async () => {
    jest.spyOn(streamApi, 'getPinnableAudiences').mockImplementation(
      () => Promise.resolve(pinnableAudiencesResponse),
    );
    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      result.current.actions.getPinnableAudiences('123');
    });

    await waitFor(() => {
      expect(isEmpty(result.current.pinAudiences)).toBeFalsy();
    });

    act(() => {
      result.current.actions.resetPinAudiences();
    });

    await waitFor(() => {
      expect(isEmpty(result.current.pinAudiences)).toBeTruthy();
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.isLoadingPinnableAudiences).toBeFalsy();
      expect(isEmpty(result.current.prevAudiences)).toBeTruthy();
      expect(result.current.canLoadMorePinnableAudiences).toBeTruthy();
    });
  });
});
