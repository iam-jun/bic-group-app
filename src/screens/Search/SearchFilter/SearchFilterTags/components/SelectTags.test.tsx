import React from 'react';
import { renderHook } from '@testing-library/react-native';
import streamApi from '~/api/StreamApi';
import SelectTags from './SelectTags';
import { fireEvent, renderWithRedux, waitFor } from '~/test/testUtils';
import useSearchFilterTagsStore from '../store';

describe('SelectTags component', () => {
  it('should check item', async () => {
    const mockResponseTags = {
      data: {
        list: [
          'abc1',
          'abc2',
        ],
      },
    };
    jest.spyOn(streamApi, 'searchTags').mockImplementation(() => Promise.resolve(mockResponseTags));

    const { result } = renderHook(() => useSearchFilterTagsStore());

    const wrapper = renderWithRedux(
      <SelectTags />,
    );

    const inputSearch = wrapper.getByTestId('search_input.input');
    fireEvent.changeText(inputSearch, 'abc');

    await waitFor(() => {
      expect(result.current.data.tags.length).toBe(2);
    });

    const tagItem1 = wrapper.getByTestId('select_tags.item_checkbox_0');
    fireEvent.press(tagItem1);

    await waitFor(() => {
      expect(result.current.selected.length).toBe(1);
    });
  });

  it('should remove item', async () => {
    const mockResponseTags = {
      data: {
        list: [
          'abc1',
          'abc2',
        ],
      },
    };
    jest.spyOn(streamApi, 'searchTags').mockImplementation(() => Promise.resolve(mockResponseTags));

    const { result } = renderHook(() => useSearchFilterTagsStore());

    const wrapper = renderWithRedux(
      <SelectTags />,
    );

    const inputSearch = wrapper.getByTestId('search_input.input');
    fireEvent.changeText(inputSearch, 'abc');

    await waitFor(() => {
      expect(result.current.data.tags.length).toBe(2);
    });

    const tagItem1 = wrapper.getByTestId('select_tags.item_checkbox_0');
    fireEvent.press(tagItem1);

    let tagSelected;
    await waitFor(() => {
      tagSelected = wrapper.getByTestId('tag.icon');
    });

    fireEvent.press(tagSelected);

    await waitFor(() => {
      expect(result.current.selected.length).toBe(0);
    });
  });
});
