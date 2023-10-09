import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';
import SearchFilterTopicsSection from './SearchFilterTopicsSection';

describe('SearchFilterTopicsSection component', () => {
  it('should remove option', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
        topics: [{
          id: '111',
          name: 'music',
        }],
      },
    });

    const rendered = renderWithRedux(<SearchFilterTopicsSection searchScreenKey="123" />);

    const removeTopic = rendered.getByTestId('tag.icon');

    fireEvent.press(removeTopic);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.topics.length).toBe(0);
    });
  });

  it('should navigate when pressing on topics section', async () => {
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

    const rendered = renderWithRedux(<SearchFilterTopicsSection searchScreenKey="123" />);

    const selectionBox = rendered.getByTestId('selection_box.btn');

    fireEvent.press(selectionBox);

    await waitFor(() => {
      expect(navigate).toBeCalled();
    });
  });
});
