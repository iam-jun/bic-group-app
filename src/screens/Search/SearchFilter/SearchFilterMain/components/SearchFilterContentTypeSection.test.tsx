import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import SearchFilterContentTypeSection from './SearchFilterContentTypeSection';
import { PostType } from '~/interfaces/IPost';

describe('SearchFilterContentTypeSection component', () => {
  it('should check option', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
      },
    });

    const rendered = renderWithRedux(<SearchFilterContentTypeSection searchScreenKey="123" />);

    const checkboxOption1 = rendered.getByTestId('search_filter_content_type_section.checkbox_content_type_1');

    fireEvent.press(checkboxOption1);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.contentType.length).toBe(1);
    });
  });

  it('should uncheck option', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
        contentType: [PostType.POST],
      },
      tempFilter: {
        contentType: [PostType.POST],
      },
    });

    const rendered = renderWithRedux(<SearchFilterContentTypeSection searchScreenKey="123" />);

    const checkboxOption1 = rendered.getByTestId('search_filter_content_type_section.checkbox_content_type_1');

    fireEvent.press(checkboxOption1);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.contentType.length).toBe(0);
    });
  });
});
