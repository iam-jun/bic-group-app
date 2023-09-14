import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import SearchFilterMain from '.';
import useModalStore from '~/store/modal';

describe('SearchFilterMain screen', () => {
  it('should show alert when back if has changed', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {},
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterMain route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));

    result.current.actions.updateTempFilterByScreenKey('123', {
      topics: [
        {
          id: '111',
          name: 'music',
        },
      ],
    });

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBe(true);
    });
  });
});
