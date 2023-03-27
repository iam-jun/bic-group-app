import groupApi from '~/api/GroupApi';
import { responseGetListRelationship } from '~/test/mock_data/blocking';
import { act, renderHook } from '~/test/testUtils';
import useBlockingStore from '../index';
import * as showToastError from '~/store/helper/showToastError';

describe('getListRelationship', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should getListRelationship success:', () => {
    const spy = jest
      .spyOn(groupApi, 'getListRelationship')
      .mockImplementation(() => Promise.resolve(responseGetListRelationship) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      result.current.actions.getListRelationship();
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.listRelationship).toEqual(responseGetListRelationship.data);
  });

  it('should getListRelationship throw error', () => {
    const spyShowToastError = jest.spyOn(showToastError, 'default');
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'getListRelationship').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useBlockingStore((state) => state));
    act(() => {
      try {
        result.current.actions.getListRelationship();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastError).toBeCalled();
  });
});
