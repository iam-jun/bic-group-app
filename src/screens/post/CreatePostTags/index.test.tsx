import { act } from '@testing-library/react-hooks';
import * as React from 'react';
import { mockGetTagsInArticle } from '~/test/mock_data/tags';
import {
  fireEvent, renderHook, renderWithRedux, waitFor,
} from '~/test/testUtils';
import CreatePostTags from '.';
import useCreatePostStore from '../CreatePost/store';
import streamApi from '~/api/StreamApi';
import MockedNavigator from '~/test/MockedNavigator';
import useSelectTagsStore from '~/components/SelectTags/store';
import useCreatePost from '../CreatePost/hooks/useCreatePost';

describe('CreatePostTags component', () => {
  it('should render list tags by selected audience', async () => {
    const response = {
      code: 200,
      data: {
        list: mockGetTagsInArticle,
        meta: {
          total: mockGetTagsInArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };
    const spyApiGetTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        chosenAudiences: [{ type: 'group', rootGroupId: '123' }],
      });
    });

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostTags />} />);

    expect(spyApiGetTagsByAudiences).toBeCalled();

    await waitFor(() => {
      const tagItems = wrapper.getAllByTestId('item_checkbox.container');
      expect(tagItems.length).toEqual(mockGetTagsInArticle.length);
    });
  });

  it('should load more', async () => {
    const response1 = {
      code: 200,
      data: {
        list: mockGetTagsInArticle.slice(0, 3),
        meta: {
          total: mockGetTagsInArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };
    const response2 = {
      code: 200,
      data: {
        list: mockGetTagsInArticle.slice(3),
        meta: {
          total: mockGetTagsInArticle.length,
          offset: 3,
        },
      },
      meta: {},
    };
    const spyApiGetTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockReturnValueOnce(
      response1 as any,
    ).mockReturnValueOnce(response2 as any);
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        chosenAudiences: [{ type: 'group', rootGroupId: '123' }],
      });
    });

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostTags />} />);

    expect(spyApiGetTagsByAudiences).toBeCalled();

    await waitFor(() => {
      const tagItems = wrapper.getAllByTestId('item_checkbox.container');
      expect(tagItems.length).toEqual(mockGetTagsInArticle.slice(0, 3).length);
    });

    const listTags = wrapper.getByTestId('create_post_tags.list_tags');

    act(() => {
      listTags.props.onEndReached();
    });

    expect(spyApiGetTagsByAudiences).toBeCalled();

    await waitFor(() => {
      const tagItems = wrapper.getAllByTestId('item_checkbox.container');
      expect(tagItems.length).toEqual(mockGetTagsInArticle.length);
    });
  });

  it('should add item tag when selecting a tag', () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      useSelectTagsStore.setState((state) => ({
        ...state,
        listTag: {
          ...state.listTag,
          items: mockGetTagsInArticle,
        },
      }));
    });

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostTags />} />);

    const tagItem = wrapper.getByTestId(`item_checkbox.item_${mockGetTagsInArticle[0].id}`);

    act(() => {
      fireEvent.press(tagItem);
    });

    expect(result.current.tempData.tags.length).toEqual(1);
  });

  it('should remove item tag when unselecting a tag', () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state));

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostTags />} />);

    act(() => {
      result.current.actions.addTagToTempData(mockGetTagsInArticle[0] as any);
      useSelectTagsStore.setState((state) => ({
        ...state,
        listTag: {
          ...state.listTag,
          items: mockGetTagsInArticle,
        },
      }));
    });

    const tagItem = wrapper.getByTestId(`item_checkbox.item_${mockGetTagsInArticle[0].id}`);

    act(() => {
      fireEvent.press(tagItem);
    });

    expect(result.current.tempData.tags.length).toEqual(0);
  });

  it('should search tag when typing a keyword', async () => {
    jest.useFakeTimers();

    const response = {
      code: 200,
      data: {
        list: mockGetTagsInArticle,
        meta: {
          total: mockGetTagsInArticle.length,
          offset: 0,
        },
      },
      meta: {},
    };
    const spyApiGetTagsByAudiences = jest.spyOn(streamApi, 'searchTagsInAudiences').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const { result } = renderHook(() => useSelectTagsStore((state) => state));

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostTags />} />);

    const searchInput = wrapper.getByTestId('search_input.input');

    act(() => {
      fireEvent.changeText(searchInput, 'abc');
      jest.advanceTimersByTime(200);
    });

    jest.useRealTimers();

    expect(spyApiGetTagsByAudiences).toBeCalled();

    await waitFor(() => {
      const tagItems = wrapper.getAllByTestId('item_checkbox.container');
      expect(tagItems.length).toEqual(mockGetTagsInArticle.length);

      expect(result.current.search.key).toEqual('abc');
      expect(result.current.search.loading).toEqual(false);
    });
  });

  it('should save selected tag', async () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state));
    const { result: createPost } = renderHook(() => useCreatePost());

    const wrapper = renderWithRedux(<MockedNavigator component={() => <CreatePostTags />} />);

    act(() => {
      result.current.actions.addTagToTempData(mockGetTagsInArticle[0] as any);
    });

    expect(createPost.current.enableButtonSaveTags).toBeTruthy();

    const btnSave = wrapper.getByTestId('header.button');

    act(() => {
      fireEvent.press(btnSave);
    });

    await waitFor(() => {
      expect(result.current.createPost.tags.length).toEqual(1);
    });
  });
});
