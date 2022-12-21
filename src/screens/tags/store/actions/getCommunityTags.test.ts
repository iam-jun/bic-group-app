import streamApi from '~/api/StreamApi';
import useCommunitiesStore from '~/store/entities/communities';
import { act, renderHook } from '~/test/testUtils';
import useTagsControllerStore from '../index';

describe('getCommunityTags', () => {
  it('give idCommunity should load that community`s tag', () => {
    const res = {
      data: {
        list: [{
          id: 'c05715c5-587d-4788-8391-718fd60cb0d0',
          groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
          name: 'ji',
          slug: 'ji',
          total_used: 0,
        }],
        meta: {
          total: 1,
        },
      },
    };

    useCommunitiesStore.setState({
      data: {
        123: {
          groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
        },
      },
    } as any);

    const spy = jest.spyOn(streamApi, 'getTags').mockImplementation(
      () => Promise.resolve(res) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useTagsControllerStore((state) => state));
    act(() => {
      result.current.actions.getCommunityTags('123');
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityTags['123'].ids.length).toBe(1);
    expect(result.current.communityTags['123'].hasNextPage).toBe(false);
    expect(result.current.communityTags['123'].loading).toBe(false);
    expect(result.current.communityTags['123'].refreshing).toBe(false);
  });
});
