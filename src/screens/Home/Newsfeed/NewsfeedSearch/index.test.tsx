import React from 'react';
import { renderWithRedux, configureStore } from '../../../../test/testUtils';
import NewsfeedSearch from '~/screens/Home/Newsfeed/NewsfeedSearch/index';
import initialState from '~/store/initialState';

describe('NewsfeedSearch component', () => {
  const mockStore = configureStore([]);

  it('should render null', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.isShow = false;
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<NewsfeedSearch headerRef={{}} />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render search', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.isShow = true;
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<NewsfeedSearch headerRef={{}} />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render suggestion', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearch.isShow = true;
    storeData.home.newsfeedSearch.isSuggestion = true;
    const store = mockStore(storeData);
    const rendered = renderWithRedux(<NewsfeedSearch headerRef={{}} />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
