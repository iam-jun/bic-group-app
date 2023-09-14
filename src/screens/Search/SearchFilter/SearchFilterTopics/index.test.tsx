import React from 'react';
import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import useSearchStore from '../../store';
import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import useModalStore from '~/store/modal';
import useSelectCategoriesStore from '~/components/SelectCategories/store';
import SearchFilterTopics from '.';
import streamApi from '~/api/StreamApi';
import { responseCategory } from '~/test/mock_data/topic';

describe('SearchFilterTopics screen', () => {
  it('should save when pressing on Save button', async () => {
    const spyApiGetCategories = jest.spyOn(streamApi, 'getCategories').mockReturnValue(Promise.resolve(responseCategory));
    useSelectCategoriesStore.getState().actions.updateSelectedCategories([{
      id: '111',
      name: 'test',
    }]);

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterTopics route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(spyApiGetCategories).toBeCalled();
    });

    const btnSave = wrapper.getByTestId('header.button');

    fireEvent.press(btnSave);

    await waitFor(() => {
      expect(result.current.search['123'].tempFilter.topics).toBeDefined();
    });
  });

  it('should show alert when pressing back', async () => {
    const spyApiGetCategories = jest.spyOn(streamApi, 'getCategories').mockReturnValue(Promise.resolve(responseCategory));
    useSelectCategoriesStore.getState().actions.updateSelectedCategories([{
      id: '111',
      name: 'test',
    }]);

    const { result } = renderHook(() => useSearchStore());

    result.current.actions.updateSearchDataByScreenKey('123', {
      tempFilter: {
      },
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <SearchFilterTopics route={{ params: { searchScreenKey: '123' } }} />
        )}
      />,
    );

    await waitFor(() => {
      expect(spyApiGetCategories).toBeCalled();
    });

    const btnBack = wrapper.getByTestId('header.back');

    fireEvent.press(btnBack);

    await waitFor(() => {
      expect(useModalStore.getState().alert.visible).toBe(true);
    });
  });
});
