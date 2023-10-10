import { renderHook, waitFor } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import { mockResponseScheduledContents } from '~/test/mock_data/schedule';
import useScheduledContentsStore from '../index';
import { ScheduledFeed } from '~/interfaces/IFeed';
import useModalStore from '~/store/modal';

describe('getScheduledContents', () => {
  it('given feed and isRefresh = true should refresh feed', async () => {
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.resolve(mockResponseScheduledContents));

    useScheduledContentsStore.setState((state) => ({
      ...state,
      scheduledFeed: {
        ...state.scheduledFeed,
        [ScheduledFeed.ALL]: {
          ...state.scheduledFeed[ScheduledFeed.ALL],
          ids: ['123'],
        },
      },
    }));

    const { result } = renderHook(() => useScheduledContentsStore());

    result.current.actions.getScheduledContents(ScheduledFeed.ALL, true);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length,
      );
    });
  });

  it('given feed and isRefresh = false should load more feed', async () => {
    const currentIds = ['123'];
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.resolve(mockResponseScheduledContents));

    useScheduledContentsStore.setState((state) => ({
      ...state,
      scheduledFeed: {
        ...state.scheduledFeed,
        [ScheduledFeed.ALL]: {
          ...state.scheduledFeed[ScheduledFeed.ALL],
          ids: currentIds,
        },
      },
    }));

    const { result } = renderHook(() => useScheduledContentsStore());

    result.current.actions.getScheduledContents(ScheduledFeed.ALL, false);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        mockResponseScheduledContents.data.list.length + currentIds.length,
      );
    });
  });

  it('should load failed', async () => {
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.reject());

    const { result } = renderHook(() => useScheduledContentsStore());

    result.current.actions.getScheduledContents(ScheduledFeed.ALL, true);

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].loading).toBe(
        false,
      );
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].refreshing).toBe(
        false,
      );
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
