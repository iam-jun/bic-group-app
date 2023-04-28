import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import Draft from '.';
import useYourContentStore from '../../store';

describe('Draft component', () => {
  it('should render DraftContent component', () => {
    useYourContentStore.setState((state) => {
      state.activeDraftTab = 0;
      return state;
    });

    const onScroll = jest.fn();
    const wrapper = renderWithRedux(<Draft onScroll={onScroll} />);

    const DraftPost = wrapper.getByTestId('draft_contents.list');
    expect(DraftPost).toBeDefined();
  });

  it('should render DraftPost component', () => {
    useYourContentStore.setState((state) => {
      state.activeDraftTab = 1;
      return state;
    });

    const onScroll = jest.fn();
    const wrapper = renderWithRedux(<Draft onScroll={onScroll} />);

    const DraftPost = wrapper.getByTestId('draft_post.list');
    expect(DraftPost).toBeDefined();
  });

  it('should render DraftArticle component', () => {
    useYourContentStore.setState((state) => {
      state.activeDraftTab = 2;
      return state;
    });

    const onScroll = jest.fn();
    const wrapper = renderWithRedux(<Draft onScroll={onScroll} />);

    const DraftArticle = wrapper.getByTestId('draft_article.list');
    expect(DraftArticle).toBeDefined();
  });

  it('should render empty when activeDraftTab null', () => {
    useYourContentStore.setState((state) => {
      state.activeDraftTab = null;
      return state;
    });

    const onScroll = jest.fn();
    const wrapper = renderWithRedux(<Draft onScroll={onScroll} />);

    const DraftArticle = wrapper.queryByTestId('draft_article.list');
    const DraftPost = wrapper.queryByTestId('draft_post.list');
    expect(DraftArticle).toBeNull();
    expect(DraftPost).toBeNull();
  });
});
