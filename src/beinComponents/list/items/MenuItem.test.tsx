import * as React from 'react';
import { cleanup } from '@testing-library/react-native';

import { fireEvent, renderWithRedux, configureStore } from '~/test/testUtils';
import MenuItem from './MenuItem';
import Icon from '~/beinComponents/Icon';
import initialState from '~/store/initialState';

afterEach(cleanup);

describe('Menu Item component', () => {
  const title = 'Menu Item Title';
  const testID = 'menu_item.test';
  const icon = 'Calendar';
  const mockStore = configureStore([]);

  it('renders correctly', () => {
    const rendered = renderWithRedux(<MenuItem title={title} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly testID', () => {
    const rendered = renderWithRedux(
      <MenuItem testID={testID} title={title} />,
    );
    const menuItem = rendered.getByTestId(testID);
    expect(menuItem).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render icon with iconProps', () => {
    const rendered = renderWithRedux(
      <MenuItem
        title={title}
        icon={icon}
        iconProps={{ icon, testID: 'menu_item.icon' }}
      />,
    );
    const iconComponent = rendered.getByTestId('menu_item.icon');
    expect(iconComponent).toBeDefined();
    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly rightSubTitle', () => {
    const rendered = renderWithRedux(
      <MenuItem title={title} rightSubTitle="Right Sub Title" />,
    );
    const rightSubTitle = rendered.getByTestId('menu_item.right_sub_title');
    expect(rightSubTitle).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly rightSubIcon', () => {
    const rendered = renderWithRedux(
      <MenuItem title={title} rightSubIcon={icon} />,
    );
    const rightSubIcon = rendered.getByTestId('menu_item.right_sub_icon');
    expect(rightSubIcon).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly subTitle', () => {
    const rendered = renderWithRedux(
      <MenuItem subTitle="Sub Title" title={title} />,
    );
    const subTitle = rendered.getByTestId('menu_item.sub_title');
    expect(subTitle).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders correctly RightComponent', () => {
    const rendered = renderWithRedux(
      <MenuItem
        RightComponent={
          <Icon testID="menu_item.right_component" icon="Check" size={20} />
        }
        title={title}
      />,
    );
    const rightComponent = rendered.getByTestId('menu_item.right_component');
    expect(rightComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
  it('should render NotificationsBadge', () => {
    const rendered = renderWithRedux(
      <MenuItem
        notificationsBadgeNumber={4}
        notificationsBadgeProps={{ testID: 'menu_item.noti_badge' }}
        title={title}
      />,
    );
    const notiBadge = rendered.getByTestId('menu_item.noti_badge');
    expect(notiBadge).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should call props onPress', () => {
    const onPress = jest.fn();

    const rendered = renderWithRedux(
      <MenuItem title={title} testID={testID} onPress={onPress} />,
    );

    const btnComponent = rendered.getByTestId(testID);
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);
    expect(onPress).toBeCalled();
  });

  it('renders correctly item disable', () => {
    const rendered = renderWithRedux(
      <MenuItem title={title} testID={testID} disabled />,
    );

    const { getByTestId } = rendered;
    const btnComponent = getByTestId(testID);
    expect(btnComponent.props?.accessibilityState?.disabled).toBe(true);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render badge Number when type= draftPost', () => {
    const storeData = { ...initialState };
    storeData.post.draftPosts.posts = [{}];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <MenuItem title={title} type="draftPost" />,
      store,
    );

    const btnComponent = rendered.getByTestId('menu_item.badge_number');
    expect(btnComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should render badge Number when type= draftPost and draftPost.length > 9', () => {
    const storeData = { ...initialState };
    storeData.post.draftPosts.posts = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    const store = mockStore(storeData);

    const rendered = renderWithRedux(
      <MenuItem title={title} type="draftPost" badgeColor="red" />,
      store,
    );

    const btnComponent = rendered.getByTestId('menu_item.badge_number.number');

    expect(btnComponent.children?.[0]).toBe('9+');
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
