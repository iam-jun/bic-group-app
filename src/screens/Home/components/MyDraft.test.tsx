import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import MyDraft from './MyDraft';
import streamApi from '~/api/StreamApi';
import useModalStore from '~/store/modal';

describe('MyDraft component', () => {
  it('renders correctly', () => {
    const response = {
      data: 10,
    };
    jest.spyOn(streamApi, 'getTotalDraft').mockImplementation(() => Promise.resolve(response) as any);

    const hideModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.hideModal = hideModal;
      return state;
    });

    const rendered = render(<MyDraft />);
    const { getByTestId } = rendered;
    const containerView = getByTestId('my_draft');
    expect(containerView).toBeDefined();

    fireEvent.press(containerView);
    expect(hideModal).toBeCalled();
  });
});
