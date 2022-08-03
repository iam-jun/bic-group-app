import {
  createStore, withDevtools, withImmer, withPersist,
} from '~/store/utils';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
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
    });
    groupsDataHelper.getCommunityGroups(id, { listBy: 'tree' }).then((response) => {
      set((state) => {
        state.loading = false;
        state.data[id] = response.data || []
      });
    }).catch((error) => {
      console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
      set((state) => {
        state.loading = false;
      });
    })
  },
});

const useJoinedGroupTreeStore = createStore<JoinedGroupTreeState>(
  withDevtools(withImmer(withPersist(useJoinedGroupTree, { name: 'communities-joined-group-tree-store' }))),
)

export default useJoinedGroupTreeStore;
