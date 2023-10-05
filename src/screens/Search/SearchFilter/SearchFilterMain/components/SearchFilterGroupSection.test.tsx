import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import { IGroup } from '~/interfaces/IGroup';
import SearchFilterGroupSection from './SearchFilterGroupSection';

describe('SearchFilterGroupSection component', () => {
  it('should remove option', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
        group: {
          icon: 'https://img.com/xyz',
          name: 'Bein test',
        } as IGroup,
        isSelectAllInnerGroups: true,
      },
    });

    const rendered = renderWithRedux(<SearchFilterGroupSection searchScreenKey="123" />);

    const removeGroup = rendered.getByTestId('search_filter_group_section.remove');

    fireEvent.press(removeGroup);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.group).toBeUndefined();
      expect(result.current.search['123'].tempFilter.isSelectAllInnerGroups).toBeFalsy();
    });
  });

  it('should toggle option select all inner group', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
        group: {
          icon: 'https://img.com/xyz',
          name: 'Bein test',
        } as IGroup,
        isSelectAllInnerGroups: true,
      },
    });

    const rendered = renderWithRedux(<SearchFilterGroupSection searchScreenKey="123" />);

    const toggle = rendered.getByTestId('search_filter_group_section.toggle');

    fireEvent.press(toggle);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.isSelectAllInnerGroups).toBeFalsy();
    });
  });
});
