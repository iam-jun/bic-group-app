/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import Terms from './Terms';
import useTermStore from '../store';

describe('Terms component', () => {
  it('should render correctly', () => {
    const groupId = 'test';
    useTermStore.setState((state) => {
      state.data[groupId] = { content: 'test' };
      return state;
    });

    const rendered = renderWithRedux(<Terms groupId={groupId} isActiveGroupTerms />);

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('terms');
    expect(containerComponent).toBeDefined();
  });
});
