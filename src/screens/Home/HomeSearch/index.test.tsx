import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import HomeSearch from './index';
import useFeedSearchStore from './store';
import useFilterToolbarStore from '~/components/FilterToolbar/store';

describe('MyDraft component', () => {
  const baseProps = {
    groupId: 'test',
  };
  it('renders correctly', () => {
    useFeedSearchStore.setState((state) => {
      state.newsfeedSearch.isShow = true;
      return state;
    });

    const resetFilter = jest.fn();
    useFilterToolbarStore.setState((state) => {
      state.reset = resetFilter;
      return state;
    });

    const rendered = render(<HomeSearch {...baseProps} />);
    const { getByTestId } = rendered;
    const containerView = getByTestId('search_base_view');
    expect(containerView).toBeDefined();

    const btnBack = getByTestId('search_base_view.back_button');
    fireEvent.press(btnBack);
    expect(resetFilter).toBeCalled();
  });
});
