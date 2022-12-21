import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useTagsControllerStore from '../index';

describe('deleteTag', () => {
  it('give id tag vs idCommunity should delete a tag', () => {
    useTagsControllerStore.setState({
      communityTags: {
        123: {
          ids: ['c05715c5-587d-4788-8391-718fd60cb0d0'],
        },
      },
    } as any);

    const spy = jest.spyOn(streamApi, 'deleteTag').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useTagsControllerStore((state) => state));
    act(() => {
      result.current.actions.deleteTag('123', 'c05715c5-587d-4788-8391-718fd60cb0d0');
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityTags['123'].ids.length).toBe(0);
  });
});
