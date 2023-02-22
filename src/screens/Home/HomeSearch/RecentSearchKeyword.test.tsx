import React from 'react';
import { renderWithRedux, fireEvent, act } from '../../../test/testUtils';
import NFSRecentSearchKeyword from './RecentSearchKeyword';
import useFeedSearchStore from './store';
import { recentSearchKeywords } from '~/test/mock_data/home';

describe('NFSRecentSearchKeyword component', () => {
  it('should render loading recent search keyword', () => {
    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearchRecentKeywords({ data: [], loading: true });
    });

    const rendered = renderWithRedux(<NFSRecentSearchKeyword />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render empty recent search keyword', () => {
    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearchRecentKeywords({ data: [], loading: false });
    });

    const rendered = renderWithRedux(<NFSRecentSearchKeyword />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render list recent search keyword', () => {
    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearchRecentKeywords({
          data: recentSearchKeywords.recentSearches,
          loading: false,
        });
    });

    const rendered = renderWithRedux(<NFSRecentSearchKeyword />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should call props onClearAllKeyword', () => {
    const onClearAllKeyword = jest.fn();

    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearchRecentKeywords({
          data: recentSearchKeywords.recentSearches,
          loading: false,
        });
    });

    const rendered = renderWithRedux(
      <NFSRecentSearchKeyword onClearAllKeyword={onClearAllKeyword} />,
    );
    const btnClear = rendered.getByTestId('recent_search_keyword.btn_clear');
    fireEvent.press(btnClear);
    expect(onClearAllKeyword).toBeCalled();
  });

  it('should call props onSelectKeyword', () => {
    const onSelectKeyword = jest.fn();

    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearchRecentKeywords({
          data: recentSearchKeywords.recentSearches,
          loading: false,
        });
    });

    const rendered = renderWithRedux(
      <NFSRecentSearchKeyword onSelectKeyword={onSelectKeyword} />,
    );
    const itemCpn = rendered.getByTestId('recent_search_keyword.item_0');
    fireEvent.press(itemCpn);
    expect(onSelectKeyword).toBeCalled();
  });

  it('should call props onDeleteKeyword', () => {
    const onDeleteKeyword = jest.fn();

    act(() => {
      useFeedSearchStore
        .getState()
        .actions.setNewsfeedSearchRecentKeywords({
          data: recentSearchKeywords.recentSearches,
          loading: false,
        });
    });

    const rendered = renderWithRedux(
      <NFSRecentSearchKeyword onDeleteKeyword={onDeleteKeyword} />,
    );
    const itemCpn = rendered.getByTestId(
      'recent_search_keyword.btn_delete_item_0',
    );
    fireEvent.press(itemCpn);
    expect(onDeleteKeyword).toBeCalled();
  });
});
