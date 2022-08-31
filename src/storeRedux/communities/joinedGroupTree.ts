import {
  createStore, withFlipper, withImmer, withPersist,
} from '~/store/utils';
import groupApi from '~/api/GroupApi';
import { IGroup } from '~/interfaces/IGroup';

interface JoinedGroupTreeState {
  data: {[key: string]: IGroup},
  loading: boolean,
  getJoinedGroupTree: any
}

const useJoinedGroupTree = (set) => ({
  data: {},
  loading: false,
  getJoinedGroupTree: (id: string) => {
    set((state) => {
      state.loading = true;
    }, false, 'getJoinedGroupTree');
    groupApi.getCommunityGroups(id, { listBy: 'tree' }).then((response) => {
      set((state) => {
        state.loading = false;
        state.data[id] = response.data || [];
      }, false, 'getJoinedGroupTree');
    }).catch((error) => {
      console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
      set((state) => {
        state.loading = false;
      }, false, 'getJoinedGroupTree');
    });
  },
});

const useJoinedGroupTreeStore = createStore<JoinedGroupTreeState | any>(
  withFlipper(
    withImmer(
      withPersist(
        useJoinedGroupTree, { name: 'communities-joined-group-tree-store' },
      ),
    ), 'communities-joined-group-tree-store',
  ),
);

export default useJoinedGroupTreeStore;
