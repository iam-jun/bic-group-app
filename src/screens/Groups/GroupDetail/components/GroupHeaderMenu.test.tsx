import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux, configureStore} from '~/test/testUtils';
import GroupHeaderMenu from './GroupHeaderMenu';
import initialState from '~/store/initialState';
import groupJoinStatus from '~/constants/groupJoinStatus';

afterEach(cleanup);

describe('GroupHeaderMenu component', () => {
  const mockStore = configureStore([]);
  const groupId = '1';

  it('renders correctly', () => {
    const rendered = renderWithRedux(<GroupHeaderMenu groupId={groupId} />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders Leave Group option when user is a group member correctly', () => {
    const storeData = {...initialState};
    storeData.groups.groupDetail.join_status = groupJoinStatus.member;
    const store = mockStore(storeData);
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
      store,
    );
    const itemComponent = queryByTestId('group_header_menu.leave_group');
    expect(itemComponent).not.toBeNull();
  });

  it('should not render Leave Group option when user is not a group member correctly', () => {
    const storeData = {...initialState};
    storeData.groups.groupDetail.join_status = groupJoinStatus.visitor;
    const store = mockStore(storeData);
    const {queryByTestId} = renderWithRedux(
      <GroupHeaderMenu groupId={groupId} />,
      store,
    );
    const itemComponent = queryByTestId('group_header_menu.leave_group');
    expect(itemComponent).toBeNull();
  });
});
