import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import CheckUpdate from './CheckUpdate';
import useCodePushStore from '~/store/codePush';

describe('CheckUpdate component', () => {
  it('should render button update status if is not production', () => {
    const sync = jest.fn();
    useCodePushStore.setState((state) => {
      state.actions = { sync } as any;
      return state;
    });

    const rendered = render(<CheckUpdate />);
    const btn = rendered.getByTestId('check_update');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
    expect(sync).toBeCalled();
  });
});
