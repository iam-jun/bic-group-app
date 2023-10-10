import { renderHook, waitFor } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import { mockResponseScheduledContents } from '~/test/mock_data/schedule';
import useScheduledContentsStore from '.';
import { ScheduledFeed } from '~/interfaces/IFeed';

describe('getScheduledContents', () => {
  it('should refresh all feeds', async () => {
    const spyApiGetScheduledContents = jest
      .spyOn(streamApi, 'getScheduledContents')
      .mockReturnValue(Promise.resolve(mockResponseScheduledContents));

    const { result } = renderHook(() => useScheduledContentsStore());

    result.current.actions.refreshAllFeeds();

    expect(spyApiGetScheduledContents).toBeCalled();

    await waitFor(() => {
      const lstScheduledContentsLength = mockResponseScheduledContents.data.list.length;
      expect(result.current.scheduledFeed[ScheduledFeed.ALL].ids.length).toBe(
        lstScheduledContentsLength,
      );
      expect(result.current.scheduledFeed[ScheduledFeed.ARTICLE].ids.length).toBe(
        lstScheduledContentsLength,
      );
      expect(result.current.scheduledFeed[ScheduledFeed.POST].ids.length).toBe(
        lstScheduledContentsLength,
      );
    });
  });
});
