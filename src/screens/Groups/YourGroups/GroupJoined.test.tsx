import React from 'react';

import {createTestStore, fireEvent, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import GroupJoined from '~/screens/Groups/YourGroups/GroupJoined';
import {communityDetailData} from '~/test/mock_data/communities';
import modalActions from '~/store/modal/actions';

describe('GroupJoined component', () => {
  it(`should render tree as default`, async () => {
    const wrapper = renderWithRedux(
      <GroupJoined communityId={communityDetailData.id} />,
    );
    const listTree = wrapper.queryByTestId('group_joined_tree');
    expect(listTree).not.toBeNull();
  });

  it('should render list flat with initModeIndex = 1', () => {
    const wrapper = renderWithRedux(
      <GroupJoined communityId={communityDetailData.id} initModeIndex={1} />,
    );
    const listFlat = wrapper.queryByTestId('group_joined_list');
    expect(listFlat).not.toBeNull();
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
