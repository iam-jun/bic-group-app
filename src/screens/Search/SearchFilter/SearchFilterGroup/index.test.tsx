import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSelectAudienceStore from '~/components/SelectAudience/store';
import useSearchStore from '../../store';
import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import SearchFilterGroup from '.';
import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';

describe('SearchFilterGroup screen', () => {
  it('should save when pressing on Save button', async () => {
    jest.spyOn(groupApi, 'getAllGroupJoinedSearch').mockImplementation(() => Promise.resolve());
    useSelectAudienceStore.getState().actions.setSelectedAudiences({
      id: '111',
    });

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterGroup route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    const btnSave = wrapper.getByTestId('header.button');

    fireEvent.press(btnSave);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.group).toBeDefined();
    });
  });

  it('should show alert when pressing back', async () => {
    jest.spyOn(groupApi, 'getAllGroupJoinedSearch').mockImplementation(() => Promise.resolve());
    useSelectAudienceStore.getState().actions.setSelectedAudiences({
      id: '111',
    });

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterGroup route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBe(true);
    });
  });
});
