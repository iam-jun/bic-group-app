import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import PreviewJoinableGroup from '.';
import { getPreviewJoinableGroupResponse, groupDetailData } from '~/test/mock_data/group';
import usePreviewJoinableGroupStore from './store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import useModalStore from '~/store/modal';

describe('PreviewJoinableGroup component', () => {
  const baseProps = {
    group: groupDetailData as any,
  };

  it('renders correctly', () => {
    usePreviewJoinableGroupStore.setState((state) => {
      state.data = [getPreviewJoinableGroupResponse.data];
      return state;
    });

    const joinNewGroup = jest.fn();
    useDiscoverGroupsStore.setState((state) => {
      state.actions.joinNewGroup = joinNewGroup;
      return state;
    });

    const hideModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.hideModal = hideModal;
      return state;
    });

    const rendered = render(<PreviewJoinableGroup {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('preview_joinable_group');
    expect(containerComponent).toBeDefined();

    const group = getByTestId('group_tree_item_1');
    fireEvent.press(group);
    expect(hideModal).toBeCalled();

    const btnJoin = getByTestId('preview_joinable_group.btn_join');
    fireEvent.press(btnJoin);
    expect(joinNewGroup).toBeCalled();
  });
});
