import React from 'react';
import groupApi from '~/api/GroupApi';
import { mockResponseFlatAudiences } from '~/test/mock_data/audiences';
import {
  act,
  fireEvent,
  renderHook,
  renderWithRedux,
  waitFor,
} from '~/test/testUtils';
import SelectAudience, { ContentType } from './index';
import useSelectAudienceStore from './store';

describe('SelectAudience component', () => {
  it('should load list audience successfully', async () => {
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.resolve(mockResponseFlatAudiences));

    const { result } = renderHook(() => useSelectAudienceStore());

    const screen = renderWithRedux(
      <SelectAudience contentType={ContentType.POST} />,
    );

    await waitFor(() => {
      expect(spyApiGetSearchAudiences).toBeCalled();
      expect(result.current.search.data).toBeDefined();
    });

    const audienceItems = screen.queryAllByTestId('audience_item');
    expect(audienceItems.length).toBe(mockResponseFlatAudiences.data.length);
  });

  it('given empty list audience should render empty view', async () => {
    const res = {
      ...mockResponseFlatAudiences,
      data: [],
      meta: {
        ...mockResponseFlatAudiences.meta,
        hasNextPage: false,
      },
    };
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.resolve(res));

    const { result } = renderHook(() => useSelectAudienceStore());

    const screen = renderWithRedux(
      <SelectAudience contentType={ContentType.POST} />,
    );

    await waitFor(() => {
      expect(spyApiGetSearchAudiences).toBeCalled();
      expect(result.current.search.data).toBeDefined();
      expect(result.current.search.data?.length).toBe(0);
    });

    const emptyView = screen.getByTestId('no_search_results');
    expect(emptyView).toBeDefined();
  });

  it('given hasNextPage = true should load more', async () => {
    const res1 = {
      ...mockResponseFlatAudiences,
      data: [...mockResponseFlatAudiences.data.slice(0, 2)],
    };
    const res2 = {
      ...mockResponseFlatAudiences,
      data: [...mockResponseFlatAudiences.data.slice(2)],
    };
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockReturnValueOnce(Promise.resolve(res1))
      .mockReturnValueOnce(Promise.resolve(res2));

    const { result } = renderHook(() => useSelectAudienceStore());

    const screen = renderWithRedux(
      <SelectAudience contentType={ContentType.POST} />,
    );

    await waitFor(() => {
      expect(spyApiGetSearchAudiences).toBeCalled();
      expect(result.current.search.data).toBeDefined();
    });

    const audienceItems = screen.queryAllByTestId('audience_item');
    expect(audienceItems.length).toBe(2);

    const lstAudiences = screen.getByTestId('select_audience.list');
    act(() => {
      lstAudiences.props.onEndReached();
    });

    await waitFor(() => {
      const audienceItemsMore = screen.queryAllByTestId('audience_item');
      expect(audienceItemsMore.length).toBe(
        mockResponseFlatAudiences.data.length,
      );
    });
  });

  it('given search text should load audience by keyword', async () => {
    const res1 = {
      ...mockResponseFlatAudiences,
      data: [...mockResponseFlatAudiences.data.slice(0, 2)],
    };
    const res2 = {
      ...mockResponseFlatAudiences,
      data: [...mockResponseFlatAudiences.data.slice(2)],
    };
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockReturnValueOnce(Promise.resolve(res2))
      .mockReturnValueOnce(Promise.resolve(res1));

    const { result } = renderHook(() => useSelectAudienceStore());

    const screen = renderWithRedux(
      <SelectAudience contentType={ContentType.POST} />,
    );

    await waitFor(() => {
      expect(spyApiGetSearchAudiences).toBeCalled();
      expect(result.current.search.data).toBeDefined();
    });

    const audienceItems = screen.queryAllByTestId('audience_item');
    expect(audienceItems.length).toBe(
      mockResponseFlatAudiences.data.length - 2,
    );

    const searchInput = screen.getByTestId('search_input.input');
    act(() => {
      fireEvent.changeText(searchInput, 'abc');
    });

    await waitFor(() => {
      const audienceItemsMore = screen.queryAllByTestId('audience_item');
      expect(audienceItemsMore.length).toBe(2);
    });
  });

  it('check an item should update selected item', async () => {
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.resolve(mockResponseFlatAudiences));

    const { result } = renderHook(() => useSelectAudienceStore());

    const screen = renderWithRedux(
      <SelectAudience contentType={ContentType.POST} />,
    );

    await waitFor(() => {
      expect(spyApiGetSearchAudiences).toBeCalled();
      expect(result.current.search.data).toBeDefined();
    });

    const audienceItems = screen.queryAllByTestId('group_item.container');
    act(() => {
      fireEvent.press(audienceItems[0]);
    });

    await waitFor(() => {
      expect(
        result.current.selectedAudiences.groups[
          mockResponseFlatAudiences.data[0].id
        ],
      ).toBeDefined();
      expect(result.current.selectedIds.groupIds.length).toBe(1);
    });
  });

  it('uncheck an item should update selected item', async () => {
    const spyApiGetSearchAudiences = jest
      .spyOn(groupApi, 'getSearchAudiences')
      .mockImplementation(() => Promise.resolve(mockResponseFlatAudiences));

    const { result } = renderHook(() => useSelectAudienceStore());

    act(() => {
      result.current.actions.updateItemSelection(
        mockResponseFlatAudiences.data[0] as any,
        true,
      );
    });

    const screen = renderWithRedux(
      <SelectAudience contentType={ContentType.POST} />,
    );

    await waitFor(() => {
      expect(spyApiGetSearchAudiences).toBeCalled();
      expect(result.current.search.data).toBeDefined();
    });

    const audienceItems = screen.queryAllByTestId('group_item.container');
    act(() => {
      fireEvent.press(audienceItems[0]);
    });

    await waitFor(() => {
      expect(
        result.current.selectedAudiences.groups[
          mockResponseFlatAudiences.data[0].id
        ],
      ).not.toBeDefined();
      expect(result.current.selectedIds.groupIds.length).toBe(0);
    });
  });
});
