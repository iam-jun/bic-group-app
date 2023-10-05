import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '../../store';
import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import useModalStore from '~/store/modal';
import useSearchFilterTagsStore from './store';
import SearchFilterTags from '.';

describe('SearchFilterTags screen', () => {
  it('should save when pressing on Save button', async () => {
    useSearchFilterTagsStore.getState().actions.updateSelectedTags(['test']);

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterTags route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    const btnSave = wrapper.getByTestId('header.button');

    fireEvent.press(btnSave);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.tags).toBeDefined();
    });
  });

  it('should show alert when pressing back', async () => {
    useSearchFilterTagsStore.getState().actions.updateSelectedTags(['test']);

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterTags route={{ params: { searchScreenKey: '123' } }} />
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
