import maintenanceApi from '~/api/MaintenanceApi';
import { IMaintenanceState } from '../index';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

const checkMaintenance
  = (set, _get) => async (isRefreshing = false) => {
    try {
      const response = await maintenanceApi.checkMaintenance();

      if (response && response?.data) {
        set((state: IMaintenanceState) => {
          state.data = response?.data;
        }, 'setMaintenanceData Success');
        if (isRefreshing && !response?.data?.enableMaintenance) {
          navigation.navigate('home');
        }
      }
    } catch (error) {
      console.error('call api checkMaintenance Failed', error);
    }
  };

export default checkMaintenance;
