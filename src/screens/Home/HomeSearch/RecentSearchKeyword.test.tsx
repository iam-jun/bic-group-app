import React from 'react';
import { renderWithRedux, configureStore, fireEvent } from '../../../test/testUtils';
import initialState from '../../../storeRedux/initialState';
import NFSRecentSearchKeyword from './RecentSearchKeyword';

describe('NFSRecentSearchKeyword component', () => {
  const mockStore = configureStore([]);

  it('should render loading recent search keyword', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearchRecentKeyword.loading = true;
    storeData.home.newsfeedSearchRecentKeyword.data = [];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<NFSRecentSearchKeyword />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render empty recent search keyword', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearchRecentKeyword.loading = false;
    storeData.home.newsfeedSearchRecentKeyword.data = [];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<NFSRecentSearchKeyword />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list recent search keyword', () => {
    const storeData = { ...initialState };
    storeData.home.newsfeedSearchRecentKeyword.loading = false;
    const item = { id: 1, keyword: 'hello' };
    storeData.home.newsfeedSearchRecentKeyword.data = [item];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<NFSRecentSearchKeyword />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should call props onClearAllKeyword', () => {
    const onClearAllKeyword = jest.fn();

    const storeData = { ...initialState };
    storeData.home.newsfeedSearchRecentKeyword.loading = false;
    const item = { id: 1, keyword: 'hello' };

    storeData.home.newsfeedSearchRecentKeyword.data = [item];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <NFSRecentSearchKeyword onClearAllKeyword={onClearAllKeyword} />,
      store,
    );
    const btnClear = rendered.getByTestId('recent_search_keyword.btn_clear');
    fireEvent.press(btnClear);
    expect(onClearAllKeyword).toBeCalled();
  });

  it('should call props onSelectKeyword', () => {
    const onSelectKeyword = jest.fn();

    const storeData = { ...initialState };
    storeData.home.newsfeedSearchRecentKeyword.loading = false;
    const item = { id: 1, keyword: 'hello' };

    storeData.home.newsfeedSearchRecentKeyword.data = [item];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <NFSRecentSearchKeyword onSelectKeyword={onSelectKeyword} />,
      store,
    );
    const itemCpn = rendered.getByTestId('recent_search_keyword.item_0');
    fireEvent.press(itemCpn);
    expect(onSelectKeyword).toBeCalled();
  });

  it('should call props onDeleteKeyword', () => {
    const onDeleteKeyword = jest.fn();

    const storeData = { ...initialState };
    storeData.home.newsfeedSearchRecentKeyword.loading = false;
    const item = { id: 1, keyword: 'hello' };

    storeData.home.newsfeedSearchRecentKeyword.data = [item];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <NFSRecentSearchKeyword onDeleteKeyword={onDeleteKeyword} />,
      store,
    );
    const itemCpn = rendered.getByTestId(
      'recent_search_keyword.btn_delete_item_0',
    );
    fireEvent.press(itemCpn);
    expect(onDeleteKeyword).toBeCalled();
  });
});
