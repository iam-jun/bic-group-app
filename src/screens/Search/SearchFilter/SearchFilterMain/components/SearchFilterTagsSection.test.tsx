import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';
import SearchFilterTagsSection from './SearchFilterTagsSection';

describe('SearchFilterTagsSection component', () => {
  it('should remove option', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
        tags: ['abc'],
      },
    });

    const rendered = renderWithRedux(<SearchFilterTagsSection searchScreenKey="123" />);

    const removeTag = rendered.getByTestId('tag.icon');

    fireEvent.press(removeTag);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.tags.length).toBe(0);
    });
  });

  it('should navigate when pressing on tags section', async () => {
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

    const rendered = renderWithRedux(<SearchFilterTagsSection searchScreenKey="123" />);

    const selectionBox = rendered.getByTestId('selection_box.btn');

    fireEvent.press(selectionBox);

    await waitFor(() => {
      expect(navigate).toBeCalled();
    });
  });
});
