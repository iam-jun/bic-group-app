import { renderHook, waitFor } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import useSearchFilterTagsStore from '../index';
import useModalStore from '~/store/modal';

describe('getTags', () => {
  it('should get tags success', async () => {
    const mockResponseTags = {
      data: {
        list: [
          'abc1',
          'abc2',
        ],
      },
    };
    const spyApiSearchTags = jest.spyOn(streamApi, 'searchTags').mockImplementation(() => Promise.resolve(mockResponseTags));

    const { result } = renderHook(() => useSearchFilterTagsStore());

    result.current.actions.getTags('abc');

    expect(spyApiSearchTags).toBeCalled();

    await waitFor(() => {
      expect(result.current.data.tags.length).toBe(2);
    });
  });

  it('should get tags failed', async () => {
    const spyApiSearchTags = jest.spyOn(streamApi, 'searchTags').mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSearchFilterTagsStore());

    result.current.actions.getTags('abc');

    expect(spyApiSearchTags).toBeCalled();

    await waitFor(() => {
      expect(useModalStore.getState().toast).toBeDefined();
    });
  });
});
