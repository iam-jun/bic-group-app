import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useTopicStore, { ITopicState } from '../index';
import { mockTopic } from '~/test/mock_data/topic';

describe('getTopicDetail', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should get TopicDetail throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(streamApi, 'getTopicDetail').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useTopicStore.setState((state: ITopicState) => {
      state.topicDetail = {} as any;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useTopicStore((state) => state));

    act(() => {
      try {
        result.current.actions.getTopicDetail(mockTopic.id);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.topicDetail).toStrictEqual({});
  });

  it('should call api get TopicDetail success', () => {
    const response = {
      data: mockTopic,
    };

    const spy = jest.spyOn(streamApi, 'getTopicDetail').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useTopicStore((state) => state));

    act(() => {
      result.current.actions.getTopicDetail(mockTopic.id);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.topicDetail).toEqual(response.data);
  });
});
