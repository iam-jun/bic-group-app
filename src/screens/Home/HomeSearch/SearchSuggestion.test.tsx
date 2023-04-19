import React from 'react';
import { fireEvent, render } from '../../../test/testUtils';
import SearchSuggestion from './SearchSuggestion';
import useFeedSearchStore from './store';

describe('SearchSuggestion component', () => {
  it('should render correctly', () => {
    const setNewsfeedSearch = jest.fn();
    useFeedSearchStore.setState((state) => {
      state.actions.setNewsfeedSearch = setNewsfeedSearch;
      state.newsfeedSearch.searchText = 'abc';
      return state;
    });

    const onSelectKeyword = jest.fn();

    const wrapper = render(<SearchSuggestion onSelectKeyword={onSelectKeyword} />);

    const btnSearch = wrapper.getByTestId('search_suggestion.btn_search');
    fireEvent.press(btnSearch);
    expect(setNewsfeedSearch).toBeCalled();
  });
});
