import { createStore, resetStore } from '~/store/utils';
import IGroupStructureState from './Interface';
import getGroupStructureCommunityTree from './actions/getGroupStructureCommunityTree';
import getGroupStructureMoveTargets from './actions/getGroupStructureMoveTargets';
import putGroupStructureMoveToTarget from './actions/putGroupStructureMoveToTarget';
import putGroupStructureReorder from './actions/putGroupStructureReorder';

const initState: IGroupStructureState = {
  communityTree: {
    loading: false,
    data: undefined,
  },
  reorder: {
    newOrder: undefined,
    loading: false,
  },
  move: {
    loading: false,
    key: '',
    targetGroups: undefined,
    movingGroup: undefined,
    selecting: undefined,
  },
};

const groupStructureStore = (set, get) => ({
  ...initState,

  actions: {
    setGroupStructureMoveSelecting: (payload: any) => {
      set((state) => {
        state.move.selecting = payload || {};
      },
      'setGroupStructureMoveSelecting');
    },

    setGroupStructureMove: (payload?:any) => {
      set((state) => {
        state.move = !!payload ? { ...payload } : initState.move;
      },
      'setGroupStructureMove');
    },

    setGroupStructureReorder: (payload?:any) => {
      set((state) => {
        state.reorder = !!payload ? { ...payload } : initState.reorder;
      },
      'setGroupStructureReorder');
    },

    getGroupStructureCommunityTree: getGroupStructureCommunityTree(set, get),
    getGroupStructureMoveTargets: getGroupStructureMoveTargets(set, get),
    putGroupStructureMoveToTarget: putGroupStructureMoveToTarget(set, get),
    putGroupStructureReorder: putGroupStructureReorder(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useGroupStructureStore = createStore<IGroupStructureState>(
  groupStructureStore,
);

export default useGroupStructureStore;
