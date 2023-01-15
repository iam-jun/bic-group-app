import { act } from '@testing-library/react-hooks';
import * as React from 'react';
import useTagsStore from '~/store/entities/tags';
import { mockTags } from '~/test/mock_data/tags';
import { renderHook, renderWithRedux } from '~/test/testUtils';
import useTagsControllerStore from '../../store';
import ListTags from './ListTags';

describe('ListTag component', () => {
  it('render correctly with default state', () => {
    const { result: resultUseTagsStore } = renderHook(() => useTagsStore());

    act(() => {
      resultUseTagsStore.current.actions.addTags(mockTags);
      useTagsControllerStore.setState({
        communityTags: {
          123: {
            ids: ['1', '2', '3', '4', '5', '6', '7'],
            loading: false,
            hasNextPage: false,
            refreshing: false,
          },
        },
      });
    });

    const wrapper = renderWithRedux(<ListTags communityId="123" />);
    expect(wrapper).toMatchSnapshot();
  });
});
