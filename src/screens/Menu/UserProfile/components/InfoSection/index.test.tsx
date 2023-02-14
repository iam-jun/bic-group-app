import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import InfoSection from './index';

describe('InfoSection component', () => {
  const props = {
    testID: 'info_section',
    title: 'test',
    rightTitle: null,
    children: null,
  };

  it('should render props correctly', () => {
    const rendered = renderWithRedux(
      <InfoSection testID={props.testID} title={props.title} rightTitle={props.rightTitle}>
        {props.children}
      </InfoSection>,
    );

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('info_section');
    expect(containerComponent).toBeDefined();
  });
});
