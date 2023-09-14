import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import SearchFilterCreatedBySection from './SearchFilterCreatedBySection';
import * as navigationHook from '~/hooks/navigation';

describe('SearchFilterCreatedBySection component', () => {
  it('should remove option', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
        createdBy: [
          {
            id: '456',
          },
        ],
      },
    });

    const rendered = renderWithRedux(<SearchFilterCreatedBySection searchScreenKey="123" />);

    const removeTagUser = rendered.getByTestId('tag.icon');

    fireEvent.press(removeTagUser);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.createdBy.length).toBe(0);
    });
  });

  it('should navigate when pressing on created by section', async () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
      },
    });

    const rendered = renderWithRedux(<SearchFilterCreatedBySection searchScreenKey="123" />);

    const selectionBox = rendered.getByTestId('selection_box.btn');

    fireEvent.press(selectionBox);

    await waitFor(() => {
      expect(navigate).toBeCalled();
    });
  });
});
