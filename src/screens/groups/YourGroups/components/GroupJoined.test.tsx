import React from 'react';

import { createTestStore, fireEvent, renderWithRedux } from '../../../../test/testUtils';
import GroupJoined from './GroupJoined';
import { communityDetailData } from '../../../../test/mock_data/communities';
import modalActions from '../../../../storeRedux/modal/actions';
import { groupDetailData } from '../../../../test/mock_data/group';

describe('GroupJoined component', () => {
  it('should render tree as default', async () => {
    const storeData: any = {
      groups: { yourGroupsTree: { loading: false, list: [groupDetailData] } },
    };
    const wrapper = renderWithRedux(
      <GroupJoined communityId={communityDetailData.id} />,
      createTestStore(storeData),
    );
    const listTree = wrapper.queryByTestId('group_joined_tree');
    expect(listTree).not.toBeNull();
  });

  it('should render tree empty screen', async () => {
    const storeData: any = {
      groups: { yourGroupsTree: { loading: false, list: [] } },
    };
    const wrapper = renderWithRedux(
      <GroupJoined communityId={communityDetailData.id} />,
      createTestStore(storeData),
    );
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).not.toBeNull();
  });

  it('should render list flat with initModeIndex = 1', () => {
    const storeData: any = {
      groups: { yourGroupsTree: { loading: false, list: [groupDetailData] } },
    };
    const wrapper = renderWithRedux(
      <GroupJoined communityId={communityDetailData.id} initModeIndex={1} />,
      createTestStore(storeData),
    );
    const listFlat = wrapper.queryByTestId('group_joined_list');
    expect(listFlat).not.toBeNull();
  });

  it('should render flat list empty screen', async () => {
    const storeData: any = {
      groups: { yourGroupsList: { loading: false, list: [] } },
    };
    const wrapper = renderWithRedux(
      <GroupJoined communityId={communityDetailData.id} initModeIndex={1} />,
      createTestStore(storeData),
    );
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).not.toBeNull();
  });

  it('should show modal mode view menu', () => {
    const spy = jest.spyOn(modalActions, 'showModal');
    const wrapper = renderWithRedux(
      <GroupJoined communityId={communityDetailData.id} initModeIndex={1} />,
    );
    const btnModeView = wrapper.getByTestId('group_joined.btn_mode_view');
    fireEvent.press(btnModeView);
    expect(spy).toBeCalled();
  });
});
