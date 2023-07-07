import { renderHook } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import initialState from '~/storeRedux/initialState';
import { createTestStore, getHookReduxWrapper } from '~/test/testUtils';
import { usePostSettings } from './usePostSettings';

describe('usePostSettings', () => {
  // it('render correctly', () => {
  //   usePostsStore.setState((state) => {
  //     state.posts = {
  //       [POST_DETAIL.id]: POST_DETAIL as any,
  //     };
  //     return state;
  //   });
  //   const props = {
  //     postId: POST_DETAIL.id,
  //     listAudiencesWithoutPermission: [],
  //   };

  //   const stateData = { ...initialState };
  //   const store = createTestStore(stateData);
  //   const wrapper = getHookReduxWrapper(store);
  //   const { result } = renderHook(() => usePostSettings(props), { wrapper });
  //   act(() => {
  //     const handlePressSave = result.current.handlePressSave();
  //     expect(handlePressSave).toEqual('putUpdateSettings');

  //     const handlePutUpdateSettings = result.current.handlePutUpdateSettings();
  //     expect(handlePutUpdateSettings).toEqual('dispatchPutEditPost');
  //   });
  // });

  it('render correctly no podId', () => {
    const props = {
      postId: null,
      listAudiencesWithoutPermission: [],
    };

    const stateData = { ...initialState };
    const store = createTestStore(stateData);
    const wrapper = getHookReduxWrapper(store);
    const { result } = renderHook(() => usePostSettings(props), { wrapper });
    act(() => {
      const handlePressSave = result.current.handlePressSave();
      expect(handlePressSave).toEqual('setCreatePostSettings');
    });
  });
});
