import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { mockArticle } from '~/test/mock_data/article';
import usePublishStore, { IPublishState } from './store';
import { IPost } from '~/interfaces/IPost';
import { renderWithRedux } from '~/test/testUtils';
import Publish from './index';
import { ContentFeed } from '~/interfaces/IFeed';
import usePostsStore from '~/store/entities/posts';

describe('Publish component', () => {
  it('render correctly', () => {
    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({ data: mockArticle } as any);
    });

    usePublishStore.setState((state: IPublishState) => {
      state.publishContents[ContentFeed.ALL].ids = [mockArticle.id] as IPost[];
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<Publish
      onScroll={onScroll}
    />);
    const contentView = rendered.getByTestId('publish.content');

    expect(contentView).toBeDefined();
  });

  it('should render empty view when data empty end cant load more', () => {
    usePublishStore.setState((state: IPublishState) => {
      state.publishContents[ContentFeed.ALL].ids = [] as IPost[];
      state.publishContents[ContentFeed.ALL].hasNextPage = false;
      return state;
    });

    const onScroll = jest.fn();

    const rendered = renderWithRedux(<Publish
      onScroll={onScroll}
    />);

    const emptyView = rendered.getByTestId('publish.empty_view');
    expect(emptyView).toBeDefined();
  });
});
