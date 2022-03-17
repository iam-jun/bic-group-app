import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux, configureStore} from '~/test/testUtils';
import GroupInfoHeader from './GroupInfoHeader';
import initialState from '~/store/initialState';
import groupJoinStatus from '~/constants/groupJoinStatus';

afterEach(cleanup);

describe('GroupInfoHeader component', () => {
  const mockStore = configureStore([]);

  it('renders correctly', () => {
    const rendered = renderWithRedux(<GroupInfoHeader />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders button Join correctly', () => {
    const {queryByTestId} = renderWithRedux(<GroupInfoHeader />);

    // onbly Join button is available
    const joinButton = queryByTestId('group_info_header.join');
    expect(joinButton).not.toBeNull();
    const cancelButton = queryByTestId('group_info_header.cancel');
    expect(cancelButton).toBeNull();
  });

  it('renders button Cancel Request correctly', () => {
    const storeData = {...initialState};
    storeData.groups.groupDetail.join_status = groupJoinStatus.requested;
    const store = mockStore(storeData);
    const {queryByTestId} = renderWithRedux(<GroupInfoHeader />, store);

    //  only Cancel button is available
    const joinButton = queryByTestId('group_info_header.join');
    expect(joinButton).toBeNull();
    const cancelButton = queryByTestId('group_info_header.cancel');
    expect(cancelButton).not.toBeNull();
  });

  it('should hide Join and Cancel buttons when user is a group member correctly', () => {
    const storeData = {...initialState};
    storeData.groups.groupDetail.join_status = groupJoinStatus.member;
    const store = mockStore(storeData);
    const {queryByTestId} = renderWithRedux(<GroupInfoHeader />, store);

    // Join and Cancel buttons are not available
    const joinButton = queryByTestId('group_info_header.join');
    expect(joinButton).toBeNull();
    const cancelButton = queryByTestId('group_info_header.cancel');
    expect(cancelButton).toBeNull();
  });
});
