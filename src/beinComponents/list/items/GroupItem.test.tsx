import * as React from 'react';
import {cleanup} from '@testing-library/react-native';

import {fireEvent, renderWithRedux} from '~/test/testUtils';
import GroupItem from './GroupItem';

afterEach(cleanup);

describe('Group Item component', () => {
  const groupItemData = {
    background_img_url: null,
    chat_id: 'rpq3unai7i8ztprmoz97rdjr7w',
    children: [],
    childrenUiIds: ['tree_0_0', 'tree_0_1'],
    created_at: '2022-01-10T10:04:48.685Z',
    deleted_at: null,
    description: 'The greatest community ever',
    disabled: false,
    group_type: 'COMPANY',
    hide: false,
    icon: '',
    id: 1,
    index: 0,
    isActive: false,
    isChecked: false,
    isCollapsing: false,
    level: 0,
    name: 'EVOL Community',
    onActionPress: 0,
    owner_id: 1,
    parentUiId: 'tree',
    parent_id: null,
    parents: null,
    privacy: 'PUBLIC',
    slug: 'evol-community-1641809088',
    subTitle: 0,
    testID: 'group_item.test',
    title: 0,
    total: 3,
    uiId: 'tree_0',
    uiLevel: 0,
    unique: '60fbc06f-99a7-40ba-95f0-4a2a76116edf',
    updated_at: '2022-01-10T10:04:48.928Z',
    user_count: '24',
  };

  it(`renders correctly`, () => {
    //@ts-ignore
    const rendered = renderWithRedux(<GroupItem {...groupItemData} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should call props onPressItem`, () => {
    const onPress = jest.fn();

    //@ts-ignore
    const rendered = renderWithRedux(
      <GroupItem {...groupItemData} onPressItem={onPress} />,
    );

    const btnComponent = rendered.getByTestId('group_item.container');
    expect(btnComponent).toBeDefined();
    fireEvent.press(btnComponent);
    expect(onPress).toBeCalled();
  });

  it(`should render UI Level when uiLevel > 0`, () => {
    const onPress = jest.fn();

    //@ts-ignore
    const rendered = renderWithRedux(
      <GroupItem {...groupItemData} uiLevel={1} onPressItem={onPress} />,
    );

    const lineComponent = rendered.getByTestId('group_item.ui_level');
    expect(lineComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should render toggle button when childrenUiIds.length > 0`, () => {
    //@ts-ignore
    const rendered = renderWithRedux(
      <GroupItem
        {...groupItemData}
        childrenUiIds={['tree_0_0_0', 'tree_0_0_1', 'tree_0_0_2']}
      />,
    );

    const toggleComponent = rendered.getByTestId('group_item.button_wrapper');
    expect(toggleComponent).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`should call props onToggleItem when rendered toggle item`, () => {
    const onPress = jest.fn();

    //@ts-ignore
    const rendered = renderWithRedux(
      <GroupItem
        {...groupItemData}
        childrenUiIds={['tree_0_0_0', 'tree_0_0_1', 'tree_0_0_2']}
        onToggleItem={onPress}
      />,
    );

    const toggleItem = rendered.getByTestId('group_item.button_wrapper');
    expect(toggleItem).toBeDefined();
    fireEvent.press(toggleItem);
    expect(onPress).toBeCalled();
  });

  it(`should render null with props hide=true`, () => {
    //@ts-ignore
    const rendered = renderWithRedux(
      <GroupItem {...groupItemData} hide={true} />,
    ).toJSON();

    expect(rendered).toBeNull();
  });

  it(`toggle should render null with props uiLevel < 0`, () => {
    //@ts-ignore
    const rendered = renderWithRedux(
      <GroupItem {...groupItemData} uiLevel={-1} />,
    );
    const toggleComponent = rendered.queryByTestId('group_item.button_wrapper');
    expect(toggleComponent).toBeNull();
  });

  it(`should call props onCheckedItem when rendered toggle item`, () => {
    const onCheckedItem = jest.fn();

    //@ts-ignore
    const rendered = renderWithRedux(
      <GroupItem
        {...groupItemData}
        childrenUiIds={['tree_0_0_0', 'tree_0_0_1', 'tree_0_0_2']}
        onCheckedItem={onCheckedItem}
      />,
    );

    const toggleItem = rendered.getByTestId('group_item.check_box');
    expect(toggleItem).toBeDefined();
    fireEvent.press(toggleItem);
    expect(onCheckedItem).toBeCalled();
  });

  it(`should render default prop`, () => {
    const fakeGroupItemData = {
      background_img_url: null,
      chat_id: 'rpq3unai7i8ztprmoz97rdjr7w',
      children: [],
      created_at: '2022-01-10T10:04:48.685Z',
      deleted_at: null,
      description: 'The greatest community ever',
      disabled: false,
      group_type: 'COMPANY',
      icon: '',
      id: 1,
      index: 0,
      isActive: false,
      level: 0,
      name: 'EVOL Community',
      onActionPress: 0,
      owner_id: 1,
      parentUiId: 'tree',
      parent_id: null,
      parents: null,
      privacy: 'PUBLIC',
      slug: 'evol-community-1641809088',
      subTitle: 0,
      title: 0,
      total: 3,
      uiId: 'tree_0',
      unique: '60fbc06f-99a7-40ba-95f0-4a2a76116edf',
      updated_at: '2022-01-10T10:04:48.928Z',
      user_count: '24',
    };
    //@ts-ignore
    const rendered = renderWithRedux(<GroupItem {...fakeGroupItemData} />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
