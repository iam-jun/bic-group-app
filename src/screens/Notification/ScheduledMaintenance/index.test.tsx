import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';

import ScheduledMaintenance from './index';

describe('ScheduledMaintenance Screen', () => {
  it('should render correctly', () => {
    const maintenanceInfo = { duration: 5, startAt: '2023-07-06T02:45:00.000Z' };
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ScheduledMaintenance route={{
            params: { maintenanceInfo },
          }}
          />
        )}
      />,
    );

    const titleComp = wrapper.getByTestId('scheduled_maintenance.title');
    expect(titleComp).toBeDefined();
  });
});
