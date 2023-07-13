import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import BadgeCollection from './index';
import useUserBadge from './store';
import { mockOwnedBadges } from '~/test/mock_data/userProfile';

describe('BadgeCollectionHeader component', () => {
  let Platform: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform = require('react-native').Platform;
  });

  const choosingBadges = [
    {
      id: 'a8cbf951-a51e-49ea-9aa5-1c1c3914567',
      name: 'test badge',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
    },
    {
      id: 'bd2989d8-6c47-45f0-8c04-785869c86655',
      name: 'test badge 2',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
    },
    {
      id: 'a34f9543-ec3f-47c0-aecb-d8ac8f6e6f513',
      name: 'test badge 3',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
    },
  ];

  const totalBadges = 10;
  it('should render correctly without props', () => {
    Platform.OS = 'android';
    const setIsEditing = jest.fn();
    const fillChoosingBadges = jest.fn();
    const removeChoosingBadges = jest.fn();

    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.isEditing = false;
      state.totalBadges = totalBadges;
      state.dataSearch = mockOwnedBadges;
      state.ownBadges = mockOwnedBadges;
      state.actions.setIsEditing = setIsEditing;
      state.actions.fillChoosingBadges = fillChoosingBadges;
      state.actions.removeChoosingBadges = removeChoosingBadges;
      return state;
    });

    const rendered = renderWithRedux(
      <BadgeCollection />,
    );

    const { getByTestId, queryByTestId, queryAllByTestId } = rendered;
    const buttonEdit = getByTestId('badge_collection_header.edit_btn');
    expect(buttonEdit).toBeDefined();
    fireEvent.press(buttonEdit);
    expect(setIsEditing).toHaveBeenCalled();

    const searchInput = queryByTestId('badge_collection.search_input');
    expect(searchInput).toBeNull();

    const badgeListItem = queryAllByTestId('badge_collection.list_badge.item');
    expect(badgeListItem.length).toEqual(mockOwnedBadges.length);

    const badgeItemInBadgeListItem = queryAllByTestId('badge_collection.badge_item');
    expect(badgeItemInBadgeListItem.length).toBeGreaterThan(0);
    fireEvent.press(badgeItemInBadgeListItem[0]);

    expect(fillChoosingBadges).not.toBeCalled();
    expect(removeChoosingBadges).not.toBeCalled();
  });

  it('should render correctly if showSearchBox = true ', () => {
    const setIsEditing = jest.fn();
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.isEditing = false;
      state.totalBadges = totalBadges;
      state.dataSearch = mockOwnedBadges;
      state.ownBadges = mockOwnedBadges;
      state.actions.setIsEditing = setIsEditing;
      return state;
    });

    const rendered = renderWithRedux(
      <BadgeCollection showSearchBox />,
    );

    const { getByTestId, queryAllByTestId, queryByTestId } = rendered;
    const buttonEdit = getByTestId('badge_collection_header.edit_btn');
    expect(buttonEdit).toBeDefined();
    fireEvent.press(buttonEdit);
    expect(setIsEditing).toHaveBeenCalled();

    const searchInput = queryByTestId('badge_collection.search_input');
    expect(searchInput).toBeDefined();

    const badgeListItem = queryAllByTestId('badge_collection.list_badge.item');
    expect(badgeListItem.length).toEqual(mockOwnedBadges.length);
  });

  it('should call searchBadges if onChangeText ', () => {
    const searchBadges = jest.fn();
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.isEditing = true;
      state.totalBadges = totalBadges;
      state.dataSearch = mockOwnedBadges;
      state.ownBadges = mockOwnedBadges;
      state.actions.searchBadges = searchBadges;
      return state;
    });

    const rendered = renderWithRedux(
      <BadgeCollection showSearchBox />,
    );

    const { queryByTestId } = rendered;

    const searchInput = queryByTestId('search_input.input');
    expect(searchInput).toBeDefined();

    fireEvent.changeText(searchInput, '  ');
    expect(searchBadges).toBeCalled();
  });

  it('should render empty view if dataSearch is empty ', () => {
    useUserBadge.setState((state) => {
      state.choosingBadges = [undefined, undefined, undefined];
      state.isEditing = false;
      state.totalBadges = 0;
      state.dataSearch = [];
      state.ownBadges = [];
      state.loadingSearch = false;
      return state;
    });

    const rendered = renderWithRedux(
      <BadgeCollection />,
    );

    const { getByTestId } = rendered;

    const emptyView = getByTestId('no_search_results');
    expect(emptyView).toBeDefined();
  });

  it('should render loading view if dataSearch is empty and loading search is true', () => {
    useUserBadge.setState((state) => {
      state.choosingBadges = [undefined, undefined, undefined];
      state.isEditing = false;
      state.totalBadges = 0;
      state.dataSearch = [];
      state.ownBadges = [];
      state.loadingSearch = true;
      return state;
    });

    const rendered = renderWithRedux(
      <BadgeCollection />,
    );

    const { queryByTestId } = rendered;

    const loadingView = queryByTestId('badge_collection.loading_search');
    expect(loadingView).toBeDefined();
  });
});
