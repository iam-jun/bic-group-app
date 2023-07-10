import React from 'react';
import usePostsStore from '~/store/entities/posts';
import { mockArticle } from '~/test/mock_data/article';
import {
  act, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import RelatedContentsInSeries from './index';
import { IPost } from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import { seriesWithItemsResponse } from '~/test/mock_data/series';
import useRelatedContentsInSeriesStore from './store';

jest.mock('mixpanel-react-native', () => ({
  __esModule: true,
  default: () => jest.fn(),
  Mixpanel: jest.fn(() => ({
    init: jest.fn(),
    getPeople: () => ({ set: jest.fn() }),
    reset: jest.fn(),
  })),
}));

describe('RelatedContentsInSeries', () => {
  it('given post in some series should show related contents', async () => {
    const spyApiGetContentsInSeries = jest.spyOn(streamApi, 'getContentsInSeries').mockImplementation(
      () => Promise.resolve(seriesWithItemsResponse) as any,
    );

    const { result } = renderHook(() => usePostsStore());
    const { result: resultRelatedContentsInSeriesStore } = renderHook(() => useRelatedContentsInSeriesStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockArticle as IPost });
    });

    renderWithRedux(<RelatedContentsInSeries postId={mockArticle.id} />);

    expect(spyApiGetContentsInSeries).toBeCalled();

    await waitFor(() => {
      expect(resultRelatedContentsInSeriesStore.current.data.length).toBe(seriesWithItemsResponse.data.series.length);
    });
  });

  it('given post in some series and fetch fail should not show anything', async () => {
    const spyApiGetContentsInSeries = jest.spyOn(streamApi, 'getContentsInSeries').mockImplementation(
      () => Promise.resolve({
        ...seriesWithItemsResponse,
        data: {
          ...seriesWithItemsResponse.data,
          series: [],
        },
      }) as any,
    );

    const { result } = renderHook(() => usePostsStore());
    const { result: resultRelatedContentsInSeriesStore } = renderHook(() => useRelatedContentsInSeriesStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockArticle as IPost });
    });

    renderWithRedux(<RelatedContentsInSeries postId={mockArticle.id} />);

    expect(spyApiGetContentsInSeries).toBeCalled();

    await waitFor(() => {
      expect(resultRelatedContentsInSeriesStore.current.data.length).toBe(0);
    });
  });
});
