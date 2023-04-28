import { act } from '@testing-library/react-hooks';
import * as React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { mockTags } from '~/test/mock_data/tags';
import { renderHook, renderWithRedux } from '~/test/testUtils';
import ListSelectedTags from './ListSelectedTags';
import useCreatePostStore from '../CreatePost/store';

describe('ListSelectedTags component', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        tags: mockTags,
      });
    });

    const wrapper = renderWithRedux(<ListSelectedTags />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render nothing if list tags is empty', () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state.actions));

    act(() => {
      result.current.updateCreatePost({
        tags: [],
      });
    });

    const wrapper = renderWithRedux(<ListSelectedTags />);

    const listTags = wrapper.queryByTestId('list_selected_tags.list_tags');
    expect(listTags).toBeNull();
  });

  it('should removable tag', () => {
    const { result } = renderHook(() => useCreatePostStore((state) => state));

    act(() => {
      result.current.actions.updateCreatePost({
        tags: mockTags,
      });
    });

    const wrapper = renderWithRedux(<ListSelectedTags />);

    const tagItem = wrapper.getAllByTestId('tag.icon');

    act(() => {
      fireEvent.press(tagItem[0]);
    });

    expect(result.current.createPost.tags.length).toEqual(mockTags.length - 1);
  });
});
