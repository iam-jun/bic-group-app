import * as React from 'react';
import { act } from '@testing-library/react-hooks';
import { render } from '~/test/testUtils';
import Maintenance from './index';
import maintenanceApi from '~/api/MaintenanceApi';
import useMaintenanceStore from '~/store/maintenance';
import { IMaintenanceData } from '~/interfaces/IMaintenance';

describe('Maintenance component', () => {
  it('render correctly', async () => {
    useMaintenanceStore.setState((state) => {
      state.data = { enableMaintenance: true } as IMaintenanceData;
      return state;
    });
    const spy = jest.spyOn(maintenanceApi, 'checkMaintenance').mockImplementation(() => Promise.resolve() as any);

    const wrapper = render(<Maintenance />);
    const { getByTestId } = wrapper;
    const containerComponent = getByTestId('maintenance');
    expect(containerComponent).toBeDefined();

    const { refreshControl } = containerComponent.props;
    await act(async () => {
      refreshControl.props.onRefresh();
    });
    expect(spy).toBeCalled();
  });
});
