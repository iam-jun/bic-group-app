import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import FloatingCreatePost from './FloatingCreatePost';
import { audiencesTree } from '~/test/mock_data/audiences';
import useModalStore from '~/store/modal';

describe('FloatingCreatePost component', () => {
  const props = {
    audience: audiencesTree,
    createFromGroupId: 'test',
  };
  it('renders correctly', () => {
    const showModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showModal = showModal;
      return state;
    });

    const rendered = render(<FloatingCreatePost {...props} />);
    const { getByTestId } = rendered;
    const containerView = getByTestId('floating_create_post');
    expect(containerView).toBeDefined();

    const btn = getByTestId('floating_create_post.btn');
    fireEvent.press(btn);
    expect(showModal).toBeCalled();
  });
});
