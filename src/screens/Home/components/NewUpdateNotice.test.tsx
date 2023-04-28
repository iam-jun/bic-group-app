import React from 'react';

import { render } from '~/test/testUtils';
import NewUpdateNotice from './NewUpdateNotice';
import useRemoteConfigStore from '~/store/remoteConfig';

describe('NewUpdateNotice component', () => {
  it('renders correctly', () => {
    useRemoteConfigStore.setState((state) => {
      state.appVersion = '2.0.0';
      return state;
    });

    const rendered = render(<NewUpdateNotice />);
    const { getByTestId } = rendered;
    const title = getByTestId('notice_panel.title');
    expect(title).toBeDefined();
  });
});
