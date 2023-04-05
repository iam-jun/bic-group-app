import { act, renderHook } from '~/test/testUtils';
import maintenanceApi from '~/api/MaintenanceApi';
import { responseCheckMaintenance } from '~/test/mock_data/maintenance';
import useMaintenanceStore from '../index';

describe('checkMaintenance', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should checkMaintenance success:', () => {
    const spy = jest
      .spyOn(maintenanceApi, 'checkMaintenance')
      .mockImplementation(() => Promise.resolve(responseCheckMaintenance) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useMaintenanceStore((state) => state));
    act(() => {
      result.current.actions.checkMaintenance();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.data).toEqual(responseCheckMaintenance.data);
  });

  it('should checkMaintenance throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(maintenanceApi, 'checkMaintenance').mockImplementation(() => Promise.reject(error) as any);

    const logError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    jest.useFakeTimers();
    const { result } = renderHook(() => useMaintenanceStore((state) => state));
    act(() => {
      try {
        result.current.actions.checkMaintenance();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(logError).toBeCalled();
  });
});
