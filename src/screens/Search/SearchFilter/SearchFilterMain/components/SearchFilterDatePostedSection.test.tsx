import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '~/screens/Search/store';
import { renderWithRedux } from '~/test/testUtils';
import SearchFilterDatePostedSection from './SearchFilterDatePostedSection';
import { TypeFilter } from '../constants';
import { endOfTime, startOfTime } from '../helper';

describe('SearchFilterDatePostedSection component', () => {
  it('should select date', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
      },
    });

    const rendered = renderWithRedux(<SearchFilterDatePostedSection searchScreenKey="123" />);

    const optionToday = rendered.getByTestId(
      `filter_date.option_${TypeFilter.Today}`,
    );

    fireEvent.press(optionToday);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.datePosted.startDate).toBe(startOfTime(TypeFilter.Today).toISOString());
      expect(result.current.search['123'].tempFilter.datePosted.endDate).toBe(endOfTime(TypeFilter.Today).toISOString());
    });
  });

  it('should reset date', async () => {
    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      filter: {
      },
      tempFilter: {
        datePosted: {
          startDate: startOfTime(TypeFilter.Today).toISOString(),
          endDate: endOfTime(TypeFilter.Today).toISOString(),
        },
      },
    });

    const rendered = renderWithRedux(<SearchFilterDatePostedSection searchScreenKey="123" />);

    const btnReset = rendered.getByTestId(
      'section_container.btn_reset',
    );

    fireEvent.press(btnReset);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.datePosted).toBeUndefined();
    });
  });
});
