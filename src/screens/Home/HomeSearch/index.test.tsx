import React from 'react';
import { renderWithRedux, act } from '../../../test/testUtils';
import HomeSearch from './index';
import useFeedSearchStore from './store';

describe('NewsfeedSearch component', () => {
  it('should render null', () => {
    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearch({
          isShow: false,
        });
    });

    const rendered = renderWithRedux(<HomeSearch />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render search', () => {
    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearch({
          isShow: true,
        });
    });

    const rendered = renderWithRedux(<HomeSearch />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render suggestion', () => {
    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearch({
          isShow: true,
          isSuggestion: true,
        });
    });

    const rendered = renderWithRedux(<HomeSearch />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
