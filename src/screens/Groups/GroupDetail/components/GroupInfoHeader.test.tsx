import React from 'react';
import {cleanup} from '@testing-library/react-native';

import {renderWithRedux, fireEvent, configureStore} from '~/test/testUtils';
import GroupInfoHeader from './GroupInfoHeader';
import initialState from '~/store/initialState';
import groupJoinStatus from '~/constants/groupJoinStatus';

afterEach(cleanup);

describe('GroupInfoHeader component', () => {
  const mockStore = configureStore([]);

  it('renders correctly', () => {
    const storeData = {...initialState};
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<GroupInfoHeader />, store);
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders button Join correctly', () => {
    const storeData = {...initialState};
    const store = mockStore(storeData);

    const {getByTestId} = renderWithRedux(<GroupInfoHeader />, store);
    const joinButton = getByTestId('group_info_header.join');
    expect(joinButton).toBeDefined();
  });

  it('renders button Cancel Request correctly', () => {
    const storeData = {...initialState};
    storeData.groups.groupDetail.join_status = groupJoinStatus.requested;
    const store = mockStore(storeData);
    const {getByTestId} = renderWithRedux(<GroupInfoHeader />, store);

    const cancelButton = getByTestId('group_info_header.cancel');
    expect(cancelButton).toBeDefined();
  });
});
