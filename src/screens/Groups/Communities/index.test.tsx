/* eslint-disable @typescript-eslint/no-var-requires */

import {act, cleanup, waitFor} from '@testing-library/react-native';
import React from 'react';
import initialState from '~/store/initialState';

import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';

import Communities from '.';
import {communities} from '~/test/mock_data/communities';
import groupsActions from '../redux/actions';
import groupsTypes from '../redux/types';
import MockedNavigator from '~/test/MockedNavigator';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

afterEach(cleanup);

describe('Communities screen', () => {
  let storeData: any;

  const mockStore = configureStore([]);

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = {...initialState};
    storeData.groups.joinedCommunities.data = [] as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should render empty list community when communities joined = 0`, async () => {
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <Communities />} />,
      store,
    );

    const emptyComponent = wrapper.getByTestId('empty_screen');
    expect(emptyComponent).toBeDefined();
  });

  it(`should navigate to community detail when click community`, async () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const callback = jest.fn();
    const mockGetMyCommunities = () => {
      return {
        type: groupsTypes.GET_JOINED_COMMUNITIES,
        payload: {callback},
      };
    };

    jest
      .spyOn(groupsActions, 'getMyCommunities')
      .mockImplementation(mockGetMyCommunities as any);
    storeData.groups.joinedCommunities.data = communities;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <Communities />} />,
      store,
    );

    const item = wrapper.getByTestId('community_item');
    expect(item).toBeDefined();
    fireEvent.press(item);

    expect(navigate).toBeCalledWith(groupStack.communityDetail, {
      communityId: 0,
    });
  });
});
