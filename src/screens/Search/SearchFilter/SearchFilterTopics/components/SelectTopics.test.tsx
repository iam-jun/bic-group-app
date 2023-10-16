import React from 'react';
import streamApi from '~/api/StreamApi';
import { fireEvent, renderWithRedux, waitFor } from '~/test/testUtils';
import {
  responseCategory,
  responseSearchCategory,
} from '~/test/mock_data/topic';
import useSelectCategoriesStore from '~/components/SelectCategories/store';
import SelectTopics from './SelectTopics';

describe('SelectTopics component', () => {
  it('should check item', async () => {
    const spyApiGetCategories = jest
      .spyOn(streamApi, 'getCategories')
      .mockReturnValue(Promise.resolve(responseCategory));

    const wrapper = renderWithRedux(<SelectTopics />);

    await waitFor(() => {
      expect(spyApiGetCategories).toBeCalled();
    });

    let topicItem1;
    await waitFor(() => {
      topicItem1 = wrapper.getByTestId(
        `select_topics.item_checkbox_${responseCategory.data.list[0].id}`,
      );
    });

    fireEvent.press(topicItem1);

    await waitFor(() => {
      expect(useSelectCategoriesStore.getState().selected.length).toBe(1);
    });
  });

  it('should uncheck item', async () => {
    const spyApiGetCategories = jest
      .spyOn(streamApi, 'getCategories')
      .mockReturnValue(Promise.resolve(responseCategory));

    const wrapper = renderWithRedux(<SelectTopics />);

    await waitFor(() => {
      expect(spyApiGetCategories).toBeCalled();
    });

    let topicItem1;
    await waitFor(() => {
      topicItem1 = wrapper.getByTestId(
        `select_topics.item_checkbox_${responseCategory.data.list[0].id}`,
      );
    });
    fireEvent.press(topicItem1);

    await waitFor(() => {
      expect(useSelectCategoriesStore.getState().selected.length).toBe(1);
    });

    const removeSelectedTopic1 = wrapper.getByTestId('tag.icon');
    fireEvent.press(removeSelectedTopic1);

    await waitFor(() => {
      expect(useSelectCategoriesStore.getState().selected.length).toBe(0);
    });
  });

  it('should search topic', async () => {
    const spyApiGetCategories = jest
      .spyOn(streamApi, 'getCategories')
      .mockReturnValueOnce(Promise.resolve(responseCategory))
      .mockReturnValueOnce(Promise.resolve(responseSearchCategory));

    const wrapper = renderWithRedux(<SelectTopics />);

    await waitFor(() => {
      expect(spyApiGetCategories).toBeCalled();
    });

    const inputSearch = wrapper.getByTestId('search_input.input');
    fireEvent.changeText(inputSearch, 'fas');

    await waitFor(() => {
      expect(useSelectCategoriesStore.getState().search.items.length).toBe(
        responseSearchCategory.data.list.length,
      );
    });
  });
});
