import { act, renderHook, waitFor } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import { seriesWithItemsResponse } from '~/test/mock_data/series';
import useRelatedContentsInSeriesStore from '../index';

jest.mock('mixpanel-react-native', () => ({
  __esModule: true,
  default: () => jest.fn(),
  Mixpanel: jest.fn(() => ({
    init: jest.fn(),
    getPeople: () => ({ set: jest.fn() }),
    reset: jest.fn(),
  })),
}));

describe('getContentsInSeries', () => {
  it('should getContentsInSeries success', async () => {
    const spyApiGetContentsInSeries = jest.spyOn(streamApi, 'getContentsInSeries').mockImplementation(
      () => Promise.resolve(seriesWithItemsResponse) as any,
    );

    const { result } = renderHook(() => useRelatedContentsInSeriesStore());

    act(() => {
      result.current.actions.getContentsInSeries(['123']);
    });

    expect(spyApiGetContentsInSeries).toBeCalled();

    await waitFor(() => {
      expect(result.current.data.length).toBe(seriesWithItemsResponse.data.series.length);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should getContentsInSeries failed', async () => {
    const spyApiGetContentsInSeries = jest.spyOn(streamApi, 'getContentsInSeries').mockImplementation(
      () => Promise.reject() as any,
    );

    const { result } = renderHook(() => useRelatedContentsInSeriesStore());

    act(() => {
      result.current.actions.getContentsInSeries(['123']);
    });

    expect(spyApiGetContentsInSeries).toBeCalled();

    await waitFor(() => {
      expect(result.current.data.length).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
