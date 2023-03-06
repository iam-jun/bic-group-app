import React from 'react';

import { configureStore, renderWithRedux } from '~/test/testUtils';
import CreatePostFooter from '~/screens/post/CreatePost/components/CreatePostFooter';
import initialState from '~/storeRedux/initialState';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import { MENTION_USER } from '~/test/mock_data/mention';

describe('CreatePostFooter component', () => {
  const mockStore = configureStore([]);
  const onPressSetting = jest.fn();
  const onPressTags = jest.fn();
  const onPressSeries = jest.fn();

  it('renders correctly mention bar with items', async () => {
    useMentionInputStore.setState((state) => {
      state.data = [MENTION_USER];
      return state;
    });
    const storeData = { ...initialState };
    const store = mockStore(storeData);

    const wrapper = renderWithRedux(<CreatePostFooter
      onPressSetting={onPressSetting}
      onPressTags={onPressTags}
      onPressSeries={onPressSeries}
    />, store);
    const items = wrapper.getAllByTestId('mention_bar.item');
    expect(items?.length).toBe(1);
  });
});
