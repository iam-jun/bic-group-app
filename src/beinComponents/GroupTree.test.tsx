import React from 'react';

import {fireEvent, renderWithRedux, waitForUpdateRedux} from '~/test/testUtils';
import GroupTree from '~/beinComponents/GroupTree';
import {GROUP_TREE, GROUP_TREE_WITH_SELECTING} from '~/test/mock_data/group';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

describe('GroupTree component', () => {
  it(`renders correctly empty tree`, async () => {
    const wrapper = renderWithRedux(<GroupTree />);
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`renders correctly tree with 3 children`, async () => {
    const wrapper = renderWithRedux(<GroupTree data={GROUP_TREE as any} />);
    const groupItems = wrapper.queryAllByTestId('group_item.container');
    expect(groupItems.length).toBe(3);
  });

  it(`renders correctly tree with array data`, async () => {
    const wrapper = renderWithRedux(
      <GroupTree data={[GROUP_TREE, GROUP_TREE] as any} />,
    );
    const groupItems = wrapper.queryAllByTestId('group_item.container');
    expect(groupItems.length).toBe(6);
  });

  it(`renders nothing with invalid data`, async () => {
    const wrapper = renderWithRedux(<GroupTree data={'data' as any} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call prop onChangeCheckedGroups', () => {
    const callback = jest.fn();
    const wrapper = renderWithRedux(
      <GroupTree data={GROUP_TREE as any} onChangeCheckedGroups={callback} />,
    );
    const groupItems = wrapper.queryAllByTestId('group_item.container');
    const group = groupItems?.[0];
    expect(group).toBeDefined();
    fireEvent.press(group);
    expect(callback).toBeCalled();
  });

  it('should call prop onPressGroup', () => {
    const callback = jest.fn();
    const wrapper = renderWithRedux(
      <GroupTree data={GROUP_TREE as any} onPressGroup={callback} />,
    );
    const groupItems = wrapper.queryAllByTestId('group_item.container');
    const group = groupItems?.[0];
    expect(group).toBeDefined();
    fireEvent.press(group);
    expect(callback).toBeCalled();
  });

  it('should renders correctly toggle group', () => {
    const wrapper = renderWithRedux(
      <GroupTree data={GROUP_TREE as any} toggleOnPress />,
    );
    const groupItems = wrapper.queryAllByTestId('group_item.container');
    const group = groupItems?.[0];
    expect(group).toBeDefined();
    fireEvent.press(group);
    expect(wrapper).toMatchSnapshot();
  });

  it('should navigate screen when press group item', () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });
    const wrapper = renderWithRedux(<GroupTree data={GROUP_TREE as any} />);
    const groupItems = wrapper.queryAllByTestId('group_item.container');
    const group = groupItems?.[0];
    expect(group).toBeDefined();
    fireEvent.press(group);
    expect(navigate).toBeCalledWith(groupStack.groupDetail, {
      groupId: "1",
      initial: true,
    });
  });

  it('should render correctly uncheck item', async () => {
    const callback = jest.fn();
    const wrapper = renderWithRedux(
      <GroupTree
        data={GROUP_TREE as any}
        selectingData={GROUP_TREE_WITH_SELECTING as any}
        toggleOnPress
        onChangeCheckedGroups={callback}
      />,
    );
    expect(wrapper).toMatchSnapshot();
    const groupItems = wrapper.queryAllByTestId('group_item.container');
    const smallestChild = groupItems?.[2];
    expect(smallestChild).toBeDefined();
    fireEvent.press(smallestChild);
    await waitForUpdateRedux();
    expect(wrapper).toMatchSnapshot();
  });
});
