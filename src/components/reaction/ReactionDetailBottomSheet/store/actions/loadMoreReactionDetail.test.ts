import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';

import { IParamGetReactionDetail, TargetType } from '~/interfaces/IPost';
import useReactionDetailStore from '../index';
import { mockListUser } from '~/test/mock_data/reactions';

describe('getReactionDetail', () => {
  it('should getReactionDetail (isReported = false) success:', () => {
    const response = {
      list: mockListUser,
    };

    const spy = jest
      .spyOn(streamApi, 'getReactionDetail')
      .mockImplementation(() => Promise.resolve(response) as any);

    useReactionDetailStore.setState((state) => {
      state.data = [1];
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useReactionDetailStore((state) => state));

    const payload: IParamGetReactionDetail = {
      reactionName: 'bic_clinking_beer_mugs',
      targetId: 'test',
      target: TargetType.POST,
      limit: 10,
    };
    act(() => {
      result.current.actions.loadMoreReactionDetail(payload);
    });

    expect(result.current.isLoadingMore).toBeTruthy();

    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();
    expect(result.current.isLoadingMore).toBeFalsy();
    expect(result.current.data.length).toEqual(mockListUser.length + 1);
    expect(result.current.canLoadMore).toBeFalsy();
  });

  it('should getReactionDetail throw error', () => {
    const payload: IParamGetReactionDetail = {
      reactionName: 'bic_clinking_beer_mugs',
      targetId: 'test',
      target: TargetType.POST,
    };

    const error = {
      code: 500,
    };

    const spy = jest.spyOn(streamApi, 'getReactionDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useReactionDetailStore.setState((state) => {
      state.data = [1];
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useReactionDetailStore((state) => state));
    act(() => {
      try {
        result.current.actions.loadMoreReactionDetail(payload);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(result.current.isLoadingMore).toBeTruthy();

    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.isLoadingMore).toBeFalsy();
    expect(result.current.data.length).toEqual(1);
    expect(result.current.canLoadMore).toBeFalsy();
  });
});
