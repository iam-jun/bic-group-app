import React from 'react';
import { renderWithRedux, configureStore } from '~/test/testUtils';
import initialState from '~/store/initialState';
import NFSSuggestion from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSSuggestion';

describe('NFSSuggestion component', () => {
  const mockStore = configureStore([]);

  it('should render button search keyword', () => {
    const onSelectKeyword = jest.fn();
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.isShow = true;
    storeData.home.newsfeedSearch.isSuggestion = true;
    storeData.home.newsfeedSearch.searchText = 'hello';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <NFSSuggestion onSelectKeyword={onSelectKeyword} />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render NFSResult', () => {
    const onSelectKeyword = jest.fn();
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.isShow = true;
    storeData.home.newsfeedSearch.isSuggestion = true;
    storeData.home.newsfeedSearch.searchText = '';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <NFSSuggestion onSelectKeyword={onSelectKeyword} />,
      store,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
