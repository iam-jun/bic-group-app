import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '../../store';
import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import useModalStore from '~/store/modal';
import userApi from '~/api/UserApi';
import { userSearchResult } from '~/test/mock_data/home';
import useSearchFilterUsersStore from './store';
import SearchFilterUsers from '.';

describe('SearchFilterUsers screen', () => {
  it('should save when pressing on Save button', async () => {
    const spyApiGetUsers = jest.spyOn(userApi, 'getUsers').mockReturnValue(Promise.resolve(userSearchResult));
    useSearchFilterUsersStore.getState().actions.updateSelectedUsers([{
      id: '111',
      avatar: 'https://img.com/xyz.png',
      username: 'khang2',
      fullname: 'Khang2',
    }]);

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterUsers route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(spyApiGetUsers).toBeCalled();
    });

    const btnSave = wrapper.getByTestId('header.button');

    fireEvent.press(btnSave);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.createdBy).toBeDefined();
    });
  });

  it('should show alert when pressing back', async () => {
    const spyApiGetUsers = jest.spyOn(userApi, 'getUsers').mockReturnValue(Promise.resolve(userSearchResult));
    useSearchFilterUsersStore.getState().actions.updateSelectedUsers([{
      id: '111',
      avatar: 'https://img.com/xyz.png',
      username: 'khang2',
      fullname: 'Khang2',
    }]);

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterUsers route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(spyApiGetUsers).toBeCalled();
    });

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBe(true);
    });
  });
});
