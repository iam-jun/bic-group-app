import { renderHook } from '~/test/testUtils';
import usePostsInProgressStore from '.';

describe('usePostsInProgressStore', () => {
  it('should setTotal', () => {
    const { result } = renderHook(() => usePostsInProgressStore());

    result.current.actions.setTotal(2);

    expect(result.current.total).toEqual(2);
  });
});
