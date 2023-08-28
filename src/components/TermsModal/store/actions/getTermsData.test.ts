import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useTermStore from '../index';
import APIErrorCode from '~/constants/apiErrorCode';

describe('get terms actions', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const groupId = 'testGroupId';

  it('should get term successfully', () => {
    const response = { data: { content: 'TEST TERMS' } };

    const spyCallApi = jest.spyOn(groupApi, 'getGroupTerms').mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useTermStore((state) => state));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      result.current.actions.getTermsData(groupId);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(result.current.data[groupId]).toEqual(response.data);
  });

  it('should get term throw error:', () => {
    const error = { code: APIErrorCode.Group.TERMS_NOT_FOUND };

    const spyCallApi = jest.spyOn(groupApi, 'getGroupTerms').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useTermStore((state) => state));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      try {
        result.current.actions.getTermsData(groupId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(spyCallApi).toBeCalled();
    expect(result.current.data[groupId]).toEqual({ content: '' });
  });
});
