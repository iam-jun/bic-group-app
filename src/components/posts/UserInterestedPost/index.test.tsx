import { act, renderHook } from '@testing-library/react-hooks';
import streamApi from '~/api/StreamApi';
import useUserSeenPostStore from './store';
import { response } from './store/__mocks__/data';

describe('UserSeenPost Screen', () => {
  it('given an idPost, should call api getSeenList', async () => {
    const fakeIdPost = '123';
    const spy = jest.spyOn(streamApi, 'getUsersInterestedPost').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useUserSeenPostStore());
    act(() => {
      result.current.getUsersInterestedPost(fakeIdPost);
    });
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.data.length).toBe(3);
  });

  it('given an idPost, should loading = false when something is wrong', async () => {
    const fakeIdPost = '123';
    const spy = jest.spyOn(streamApi, 'getUsersInterestedPost').mockImplementation(
      () => Promise.reject() as any,
    );

    const { result, waitForNextUpdate } = renderHook(() => useUserSeenPostStore());
    act(() => {
      result.current.getUsersInterestedPost(fakeIdPost);
    });
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(spy).toBeCalled();
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.data.length).toBe(0);
  });
});
