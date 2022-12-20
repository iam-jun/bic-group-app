import * as React from 'react';
import useTagsStore from '~/store/entities/tags';
import { mockTags } from '~/test/mock_data/tags';
import {
  act, renderHook, renderWithRedux,
} from '~/test/testUtils';
import Tags from '.';
import useTagsControllerStore from '../store';

describe('Tags screen', () => {
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

    const wrapper = renderWithRedux(<Tags route={{
      params: {
        id: '123',
        type: 'community',
      },
    }}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
