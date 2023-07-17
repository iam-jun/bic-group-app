import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import Grid from './Grid';
import useUserBadge from './store';

describe('Grid component', () => {
  const badges = [
    {
      id: 'a8cbf951-a51e-49ea-9aa5-1c1c3914567',
      name: 'test badge',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
    }];
  it('should render item with full props', () => {
    const onPress = jest.fn();

    const rendered = renderWithRedux(
      <Grid
        data={badges}
        disabled={false}
        onPress={onPress}
      />,
    );

    const { getAllByTestId, queryAllByTestId } = rendered;
    const badgeList = getAllByTestId('badge_collection.list_badges');
    expect(badgeList).toBeDefined();

    const badgeItems = queryAllByTestId('badge_collection.badge_item');
    expect(badgeItems.length).toBe(badges.length);

    fireEvent.press(badgeItems[0]);
    expect(onPress).toBeCalled();
  });

  it('should not render if data is empty', () => {
    const onPress = jest.fn();

    const rendered = renderWithRedux(
      <Grid
        data={[]}
        disabled={false}
        onPress={onPress}
      />,
    );

    const { queryByTestId } = rendered;
    const badgeList = queryByTestId('badge_collection.list_badges');
    expect(badgeList).toBeNull();
  });

  it('should call markNewBadgeInCommunity if props isNew = true', () => {
    const markNewBadgeInCommunity = jest.fn();
    useUserBadge.setState((state) => {
      state.actions.markNewBadgeInCommunity = markNewBadgeInCommunity;
      return state;
    });
    const onPress = jest.fn();

    renderWithRedux(
      <Grid
        data={badges}
        isNew
        disabled={false}
        onPress={onPress}
      />,
    );

    expect(markNewBadgeInCommunity).toBeCalled();
  });
});
