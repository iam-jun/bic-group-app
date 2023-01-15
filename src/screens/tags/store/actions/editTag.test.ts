import streamApi from '~/api/StreamApi';
import useTagsStore from '~/store/entities/tags';
import { act, renderHook } from '~/test/testUtils';
import useTagsControllerStore from '../index';

describe('editTag', () => {
  it('give a tag should edit that tag', () => {
    const res = {
      data: {
        id: '2',
        name: 'tag edited',
        slug: 'tag-2',
        totalUsed: 0,
        groupId: '1',
        createdBy: '',
        updatedBy: '',
      },
    };

    useTagsStore.setState({
      tags: {
        2: {
          id: '2',
          name: 'tag 2',
          slug: 'tag-2',
          totalUsed: 0,
          groupId: '1',
          createdBy: '',
          updatedBy: '',
        },
      },
    });

    const spy = jest.spyOn(streamApi, 'editTag').mockImplementation(
      () => Promise.resolve(res) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useTagsControllerStore((state) => state));
    act(() => {
      result.current.actions.editTag({
        id: '2',
        name: 'tag edited',
      });
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(useTagsStore.getState().tags['2'].name).toBe('tag edited');
  });
});
