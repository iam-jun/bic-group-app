import * as React from 'react';
import { ANIMATED_EMOJI, STATIC_EMOJI } from '~/resources/emoji';
import initialState from '~/storeRedux/initialState';
import {
  createTestStore, fireEvent, renderWithRedux, setHookTestState,
} from '~/test/testUtils';

import SelectReactionView from '.';

describe('SelectReactionView component', () => {
  const baseProps = {
    onPressReaction: jest.fn(),
  };

  const store = createTestStore(initialState);

  const reactMock = require('react');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const rendered = renderWithRedux(<SelectReactionView {...baseProps} />, store);

    expect(rendered).toMatchSnapshot();
  });

  it('renders correctly with animated', () => {
    reactMock.useState = setHookTestState({
      selectedIndex: 1,
      contentHeight: 160,
      data: ANIMATED_EMOJI,
    });
    const rendered = renderWithRedux(<SelectReactionView {...baseProps} />, store);
    const item = rendered.getByTestId('select_reaction_view.item_bic_airplane');

    expect(item).toBeDefined();
  });

  it('should call onPressReaction', () => {
    reactMock.useState = setHookTestState({
      selectedIndex: 0,
      contentHeight: 160,
      data: STATIC_EMOJI,
    });
    const onPressReaction = jest.fn();
    const rendered = renderWithRedux(<SelectReactionView onPressReaction={onPressReaction} />, store);
    const item = rendered.getByTestId('select_reaction_view.item_bic_check_mark');

    fireEvent.press(item);

    expect(item).toBeDefined();
    expect(onPressReaction).toHaveBeenCalledWith('bic_check_mark');
  });
});
