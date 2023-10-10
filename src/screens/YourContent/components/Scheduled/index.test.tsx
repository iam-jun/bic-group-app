import React from 'react';
import {
  fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import Scheduled from '.';
import { mockResponseScheduledContents, mockResponseScheduledContentsEmpty, mockResponseScheduledContentsLoadMore } from '~/test/mock_data/schedule';
import streamApi from '~/api/StreamApi';
import useScheduledContentsStore from './store';
import { ScheduledFeed } from '~/interfaces/IFeed';

describe('Scheduled', () => {
  it('should show empty view', async () => {
    const mockOnScroll = jest.fn();
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.resolve(mockResponseScheduledContentsEmpty));

    const rendered = renderWithRedux(<Scheduled onScroll={mockOnScroll} />);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(rendered.getByTestId('scheduled.empty_view')).toBeDefined();
    });
  });

  it('should fetch data success', async () => {
    const mockOnScroll = jest.fn();
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.resolve(mockResponseScheduledContents));

    const { result } = renderHook(() => useScheduledContentsStore());

    renderWithRedux(<Scheduled onScroll={mockOnScroll} />);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length,
      );
    });
  });

  it('should load more data success', async () => {
    const mockOnScroll = jest.fn();
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValueOnce(Promise.resolve(mockResponseScheduledContents))
      .mockReturnValueOnce(Promise.resolve(mockResponseScheduledContentsLoadMore));

    const { result } = renderHook(() => useScheduledContentsStore());

    const rendered = renderWithRedux(<Scheduled onScroll={mockOnScroll} />);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length,
      );
    });

    const flatlist = rendered.getByTestId('scheduled.content');
    flatlist.props.onEndReached();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length + mockResponseScheduledContentsLoadMore.data.list.length,
      );
    });
  });

  it('should refresh data success', async () => {
    const mockOnScroll = jest.fn();
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.resolve(mockResponseScheduledContents));

    const { result } = renderHook(() => useScheduledContentsStore());

    const rendered = renderWithRedux(<Scheduled onScroll={mockOnScroll} />);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length,
      );
    });

    const flatlist = rendered.getByTestId('scheduled.content');
    expect(flatlist).toBeDefined();

    const { refreshControl } = flatlist.props;
    refreshControl.props.onRefresh();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length,
      );
    });
  });

  it('should call onScroll when scrolling', async () => {
    const eventData = {
      nativeEvent: {
        contentOffset: {
          y: 500,
        },
        contentSize: {
          // Dimensions of the scrollable content
          height: 500,
          width: 100,
        },
        layoutMeasurement: {
          // Dimensions of the device
          height: 100,
          width: 100,
        },
      },
    };
    const mockOnScroll = jest.fn();
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.resolve(mockResponseScheduledContents));

    const { result } = renderHook(() => useScheduledContentsStore());

    const rendered = renderWithRedux(<Scheduled onScroll={mockOnScroll} />);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length,
      );
    });

    const flatlist = rendered.getByTestId('scheduled.content');
    expect(flatlist).toBeDefined();

    fireEvent.scroll(flatlist, eventData);

    await waitFor(() => {
      expect(mockOnScroll).toBeCalled();
    });
  });
});
