import React from 'react';
import { PostType } from '~/interfaces/IPost';
import {
  act, fireEvent, renderHook, renderWithRedux,
} from '~/test/testUtils';
import FilterPostType from './FilterPostType';
import useFilterToolbarStore from './store';

describe('FilterPostType component', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const { postType } = result.current;
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterPostType selectedPostType={postType} onSelect={onSelect} />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render with init data correctly', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));

    act(() => {
      result.current.actions.setFilterPostType(PostType.ARTICLE);
    });

    const { postType } = result.current;
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterPostType selectedPostType={postType} onSelect={onSelect} />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should pressable', () => {
    const { result } = renderHook(() => useFilterToolbarStore((state) => state));
    const { postType } = result.current;
    const onSelect = jest.fn();

    const rendered = renderWithRedux(<FilterPostType selectedPostType={postType} onSelect={onSelect} />);

    const btnPost = rendered.getByTestId(`btn_post_type_${PostType.POST}`);
    const btnArticle = rendered.getByTestId(`btn_post_type_${PostType.ARTICLE}`);
    const btnSeries = rendered.getByTestId(`btn_post_type_${PostType.SERIES}`);

    fireEvent.press(btnPost);
    expect(onSelect).toBeCalled();

    fireEvent.press(btnArticle);
    expect(onSelect).toBeCalled();

    fireEvent.press(btnSeries);
    expect(onSelect).toBeCalled();
  });
});
