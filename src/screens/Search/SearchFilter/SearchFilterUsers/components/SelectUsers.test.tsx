import React from 'react';
import { fireEvent, renderWithRedux, waitFor } from '~/test/testUtils';

import userApi from '~/api/UserApi';
import { userSearchResult, userSearchResult2 } from '~/test/mock_data/home';
import SelectUsers from './SelectUsers';
import useSearchFilterUsersStore from '../store';

describe('SelectUsers component', () => {
  it('should check item', async () => {
    const spyApiGetUsers = jest
      .spyOn(userApi, 'getUsers')
      .mockReturnValue(Promise.resolve(userSearchResult));

    const wrapper = renderWithRedux(<SelectUsers />);

    await waitFor(() => {
      expect(spyApiGetUsers).toBeCalled();
    });

    let userItem1;
    await waitFor(() => {
      userItem1 = wrapper.getByTestId(
        `select_users.user_item_checkbox_${userSearchResult.data[0].id}`,
      );
    });

    fireEvent.press(userItem1);

    await waitFor(() => {
      expect(useSearchFilterUsersStore.getState().selected.length).toBe(1);
    });
  });

  it('should uncheck item', async () => {
    const spyApiGetUsers = jest
      .spyOn(userApi, 'getUsers')
      .mockReturnValue(Promise.resolve(userSearchResult));

    const wrapper = renderWithRedux(<SelectUsers />);

    await waitFor(() => {
      expect(spyApiGetUsers).toBeCalled();
    });

    let userItem1;
    await waitFor(() => {
      userItem1 = wrapper.getByTestId(
        `select_users.user_item_checkbox_${userSearchResult.data[0].id}`,
      );
    });

    fireEvent.press(userItem1);

    await waitFor(() => {
      expect(useSearchFilterUsersStore.getState().selected.length).toBe(1);
    });

    const removeSelectedUser1 = wrapper.getByTestId('tag.icon');
    fireEvent.press(removeSelectedUser1);

    await waitFor(() => {
      expect(useSearchFilterUsersStore.getState().selected.length).toBe(0);
    });
  });

  it('should search user', async () => {
    const spyApiGetUsers = jest
      .spyOn(userApi, 'getUsers')
      .mockReturnValueOnce(Promise.resolve(userSearchResult))
      .mockReturnValueOnce(Promise.resolve(userSearchResult2));

    const wrapper = renderWithRedux(<SelectUsers />);

    await waitFor(() => {
      expect(spyApiGetUsers).toBeCalled();
    });

    const inputSearch = wrapper.getByTestId('search_input.input');
    fireEvent.changeText(inputSearch, 'khang');

    await waitFor(() => {
      expect(useSearchFilterUsersStore.getState().search.items.length).toBe(
        userSearchResult2.data.length,
      );
    });
  });
});
