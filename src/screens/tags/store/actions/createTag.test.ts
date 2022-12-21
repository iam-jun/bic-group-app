import streamApi from '~/api/StreamApi';
import { act, renderHook } from '~/test/testUtils';
import useTagsControllerStore from '../index';

describe('createTag', () => {
  it('give tag vs idCommunity should create a new tag', () => {
    const res = {
      data: {
        id: 'c05715c5-587d-4788-8391-718fd60cb0d0',
        groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        name: 'ji',
        slug: 'ji',
        total_used: 0,
      },
    };
    const spy = jest.spyOn(streamApi, 'addTag').mockImplementation(
      () => Promise.resolve(res) as any,
    );
    const newTag = {
      groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      name: 'ji',
    };

    jest.useFakeTimers();

    const { result } = renderHook(() => useTagsControllerStore((state) => state));
    act(() => {
      result.current.actions.createTag('123', newTag);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.communityTags['123']).toBeDefined();
  });
});
