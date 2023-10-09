import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import useSearchStore from '../index';
import streamApi from '~/api/StreamApi';
import { mockResponseSearch } from '~/test/mock_data/search';
import { PostType } from '~/interfaces/IPost';
import useModalStore from '~/store/modal';

describe('searchContent', () => {
  it('given keyword should save success', async () => {
    jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(streamApi, 'postNewRecentSearchKeyword')
      .mockImplementation(() => Promise.resolve());
    const spyApiSearchContent = jest
      .spyOn(streamApi, 'searchContent')
      .mockImplementation(() => Promise.resolve(mockResponseSearch));

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.initSearchDataByScreenKey('123');

    result.current.actions.searchContent({
      searchScreenKey: '123',
      searchText: 'test',
      contentType: [PostType.POST],
      group: {
        id: 'zzz',
      },
      isSelectAllInnerGroups: true,
      tags: ['test'],
      topics: [
        {
          id: 'hhh',
        },
      ],
      createdBy: [
        {
          id: 'iii',
        },
      ],
      datePosted: {
        startDate: '2023-09-12T00:00:00.000Z',
        endDate: '2023-09-12T11:59:00.000Z',
      },
    } as any);

    expect(spyApiSearchContent).toBeCalled();

    await waitFor(() => {
      expect(result.current.search['123'].searchResults.length).toBe(
        mockResponseSearch.list.length,
      );
    });
  });

  it('given keyword should save error', async () => {
    jest
      .spyOn(streamApi, 'getRecentSearchKeywords')
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(streamApi, 'postNewRecentSearchKeyword')
      .mockImplementation(() => Promise.resolve());
    const spyApiSearchContent = jest
      .spyOn(streamApi, 'searchContent')
      .mockImplementation(() => Promise.reject());

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.initSearchDataByScreenKey('123');

    result.current.actions.searchContent({
      searchScreenKey: '123',
      searchText: 'test',
      contentType: [PostType.POST],
      group: {
        id: 'zzz',
      },
      isSelectAllInnerGroups: true,
      tags: ['test'],
      topics: [
        {
          id: 'hhh',
        },
      ],
      createdBy: [
        {
          id: 'iii',
        },
      ],
      datePosted: {
        startDate: '2023-09-12T00:00:00.000Z',
        endDate: '2023-09-12T11:59:00.000Z',
      },
    } as any);

    expect(spyApiSearchContent).toBeCalled();

    await waitFor(() => {
      expect(useModalStore.getState().toast).toBeDefined();
      expect(result.current.search['123'].searchResults.length).toBe(0);
    });
  });
});
