import { isEqual } from 'lodash';
import streamApi from '~/api/StreamApi';
import { pinnableAudiencesResponse } from '~/test/mock_data/pinContent';
import { act, renderHook, waitFor } from '~/test/testUtils';
import usePinContent, { PinAudiences } from '../index';

describe('getPinnableAudiences action', () => {
  it('given getPinnableAudiences failed should not show loading', async () => {
    const spyApiGetPinnableAudiences = jest.spyOn(streamApi, 'getPinnableAudiences').mockImplementation(
      () => Promise.resolve({}),
    );

    const { result } = renderHook(() => usePinContent((state) => state));

    act(() => {
      result.current.actions.getPinnableAudiences('123');
    });

    expect(spyApiGetPinnableAudiences).toBeCalled();

    await waitFor(() => {
      expect(result.current.isLoadingPinnableAudiences).toBeFalsy();
    });
  });

  it('given getPinnableAudiences success should return data', async () => {
    const spyApiGetPinnableAudiences = jest.spyOn(streamApi, 'getPinnableAudiences').mockImplementation(
      () => Promise.resolve(pinnableAudiencesResponse),
    );

    const { result } = renderHook(() => usePinContent((state) => state));

    act(() => {
      result.current.actions.getPinnableAudiences('123');
    });

    expect(spyApiGetPinnableAudiences).toBeCalled();

    await waitFor(() => {
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
      expect(result.current.isLoadingPinnableAudiences).toBeFalsy();
      expect(result.current.canLoadMorePinnableAudiences).toBeFalsy();
      expect(isEqual(result.current.pinAudiences, pinAudiences)).toBeTruthy();
      expect(isEqual(result.current.prevAudiences, pinnableAudiencesResponse.data.groups)).toBeTruthy();
    });
  });
});
