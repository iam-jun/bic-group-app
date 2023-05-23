import React from 'react';
import useSelectAudienceStore from '../store';
import {
  act,
  fireEvent,
  renderWithRedux,
  waitFor,
} from '~/test/testUtils';
import SelectedAudiences from './SelectedAudiences';
import { mockResponseFlatAudiences } from '~/test/mock_data/audiences';

describe('SelectedAudiences component', () => {
  it('should render correctly', () => {
    const selected1 = mockResponseFlatAudiences.data[0];
    const selected2 = mockResponseFlatAudiences.data[1];

    act(() => {
      useSelectAudienceStore.setState((state) => ({
        ...state,
        selectedAudiences: {
          ...state.selectedAudiences,
          groups: {
            [selected1.id]: selected1,
            [selected2.id]: selected2,
          },
        },
      }));
    });

    const component = renderWithRedux(
      <SelectedAudiences />,
    );

    const items = component.queryAllByTestId('tag_', { exact: false });
    expect(items.length).toBe(2);
  });

  it('should remove successfully', async () => {
    const selected1 = mockResponseFlatAudiences.data[0];
    const selected2 = mockResponseFlatAudiences.data[1];

    act(() => {
      useSelectAudienceStore.setState((state) => ({
        ...state,
        selectedAudiences: {
          ...state.selectedAudiences,
          groups: {
            [selected1.id]: selected1,
            [selected2.id]: selected2,
          },
        },
      }));
    });

    const component = renderWithRedux(
      <SelectedAudiences />,
    );

    const closeBtns = component.queryAllByTestId('tag.icon');
    act(() => {
      fireEvent.press(closeBtns[0]);
    });

    await waitFor(() => {
      const itemsRemain = component.queryAllByTestId('tag_', { exact: false });
      expect(itemsRemain.length).toBe(1);
    });
  });
});
