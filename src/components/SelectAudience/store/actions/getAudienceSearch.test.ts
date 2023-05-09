import { act, renderHook, waitFor } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import { mockResponseFlatAudiences } from '~/test/mock_data/audiences';
import useSelectAudienceStore from '../index';
import { ContentType } from '../..';

describe('action getAudienceSearch', () => {
  it('given isRefresh = true should refresh data', async () => {
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.resolve(mockResponseFlatAudiences));

    const { result } = renderHook(() => useSelectAudienceStore((state) => state));

    act(() => {
      result.current.actions.getAudienceSearch('abc', ContentType.POST, true);
    });

    expect(spyApiGetSearchAudiences).toBeCalled();

    await waitFor(() => {
      expect(result.current.search.data?.length).toBe(
        mockResponseFlatAudiences.data.length,
      );
      expect(result.current.search.key).toBe('abc');
      expect(result.current.search.hasNextPage).toBe(true);
      expect(result.current.search.contentType).toBe(ContentType.POST);
      expect(result.current.search.loading).toBe(false);
    });
  });

  it('given isRefresh = false should load more data', async () => {
    const res = {
      ...mockResponseFlatAudiences,
      data: [...mockResponseFlatAudiences.data.slice(1)],
    };
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.resolve(res));

    const { result } = renderHook(() => useSelectAudienceStore((state) => state));

    act(() => {
      useSelectAudienceStore.setState((state) => ({
        ...state,
        search: {
          ...state.search,
          data: [mockResponseFlatAudiences.data[0]],
        },
      }));
    });

    act(() => {
      result.current.actions.getAudienceSearch('abc', ContentType.POST, false);
    });

    expect(spyApiGetSearchAudiences).toBeCalled();

    await waitFor(() => {
      expect(result.current.search.data?.length).toBe(
        mockResponseFlatAudiences.data.length,
      );
      expect(result.current.search.key).toBe('abc');
      expect(result.current.search.hasNextPage).toBe(true);
      expect(result.current.search.contentType).toBe(ContentType.POST);
      expect(result.current.search.loading).toBe(false);
    });
  });

  it('should load data fail', async () => {
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSelectAudienceStore((state) => state));

    act(() => {
      result.current.actions.getAudienceSearch('abc', ContentType.POST, true);
    });

    expect(spyApiGetSearchAudiences).toBeCalled();

    await waitFor(() => {
      expect(result.current.search.data).not.toBeDefined();
      expect(result.current.search.key).toBe('abc');
      expect(result.current.search.hasNextPage).toBe(false);
      expect(result.current.search.contentType).not.toBeDefined();
      expect(result.current.search.loading).toBe(false);
    });
  });
});
