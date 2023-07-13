import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import GridItem from './GridItem';
import useUserBadge from './store';
import { mockBadges } from '~/test/mock_data/userProfile';

describe('GridItem component', () => {
  const item = {
    id: 'a8cbf951-a51e-49ea-9aa5-1c1c39142b3e',
    name: 'test badge',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
  };

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

  it('should call onPress when press item', () => {
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.badges = mockBadges;
      return state;
    });
    const onPress = jest.fn();

    const rendered = renderWithRedux(
      <GridItem
        id={item.id}
        disabled={false}
        onPress={onPress}
      />,
    );

    const { getByTestId } = rendered;
    const itemBadgeComp = getByTestId('badge_collection.badge_item');
    expect(itemBadgeComp).toBeDefined();
    fireEvent.press(itemBadgeComp);
    expect(onPress).toHaveBeenCalled();
  });

  it('should render icon checked when item is selected', () => {
    const onPress = jest.fn();
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.badges = mockBadges;
      return state;
    });

    const rendered = renderWithRedux(
      <GridItem
        id={choosingBadges[0].id}
        disabled={false}
        onPress={onPress}
      />,
    );

    const { getByTestId } = rendered;
    const itemBadgeComp = getByTestId('badge_collection.badge_item');
    expect(itemBadgeComp).toBeDefined();
    fireEvent.press(itemBadgeComp);
    expect(onPress).toHaveBeenCalled();

    const checkedItemBadgeComp = getByTestId('badge_collection.badge_item.checked');
    expect(checkedItemBadgeComp).toBeDefined();
  });

  it('should render disabled item when there are already 3 items selected and the item is not among them', () => {
    const onPress = jest.fn();
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.badges = mockBadges;
      return state;
    });

    const rendered = renderWithRedux(
      <GridItem
        id="a8cbf951-a51e-49ea-9aa5-1c1c39142b3e"
        disabled
        onPress={onPress}
      />,
    );

    const { getByTestId } = rendered;
    const itemBadgeComp = getByTestId('badge_collection.badge_item');
    expect(itemBadgeComp).toBeDefined();
    fireEvent.press(itemBadgeComp);
    expect(onPress).not.toHaveBeenCalled();

    const disabledItemBadgeComp = getByTestId('badge_collection.badge_item.disabled');
    expect(disabledItemBadgeComp).toBeDefined();
  });

  it('should render badge new', () => {
    const onPress = jest.fn();
    useUserBadge.setState((state) => {
      state.choosingBadges = choosingBadges;
      state.badges = mockBadges;
      return state;
    });

    const rendered = renderWithRedux(
      <GridItem
        id="a8cbf951-a51e-49ea-9aa5-1c1c39142b3e"
        shouldHideBadgeNew={false}
        onPress={onPress}
      />,
    );

    const { getByTestId } = rendered;
    const itemBadgeComp = getByTestId('badge_collection.badge_item');
    expect(itemBadgeComp).toBeDefined();
    fireEvent.press(itemBadgeComp);
    expect(onPress).toHaveBeenCalled();

    const badgeNewComp = getByTestId('badge_collection.badge_item.badge_new');
    expect(badgeNewComp).toBeDefined();
  });
});
