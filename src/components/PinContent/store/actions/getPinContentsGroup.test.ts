import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import usePinContentStore from '../index';
import { mockArticle } from '~/test/mock_data/article';

describe('action getPinContentsGroup', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call api getPinContentsGroup throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getPinContentsGroup').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      try {
        result.current.actions.getPinContentsGroup('1');
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupPinContent['1'].isLoading).toBe(false);
    expect(result.current.groupPinContent['1'].data).toEqual([]);
  });

  it('should call api getPinContentsGroup success', () => {
    const spy = jest.spyOn(streamApi, 'getPinContentsGroup').mockImplementation(
      () => Promise.resolve({ data: [mockArticle] }),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      result.current.actions.getPinContentsGroup('1');
    });
    expect(result.current.groupPinContent['1'].isLoading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupPinContent['1'].isLoading).toBe(false);
    expect(result.current.groupPinContent['1'].data).toEqual([mockArticle.id]);
  });

  it('should not call api getPinContentsGroup success when id is empty', () => {
    const spy = jest.spyOn(streamApi, 'getPinContentsGroup').mockImplementation(
      () => Promise.resolve({ data: [mockArticle] }),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => usePinContentStore((state) => state));

    act(() => {
      result.current.actions.getPinContentsGroup('');
    });
    expect(spy).not.toBeCalled();
  });
});
