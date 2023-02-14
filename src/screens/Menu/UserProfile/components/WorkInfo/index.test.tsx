import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import WorkInfo from './index';

describe('WorkInfo component', () => {
  const style = { marginTop: 8, textAlign: 'center' };

  it('should render props correctly', () => {
    const latestWork = { company: 'Test', titlePosition: 'Test' };
    const rendered = renderWithRedux(<WorkInfo style={style} latestWork={latestWork} />);

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('work_info');
    expect(containerComponent).toBeDefined();
  });

  it('should not render', () => {
    const latestWork = null;
    const rendered = renderWithRedux(<WorkInfo style={style} latestWork={latestWork} />);

    const { queryByTestId } = rendered;
    const containerComponent = queryByTestId('work_info');
    expect(containerComponent).toBeNull();
  });
});
