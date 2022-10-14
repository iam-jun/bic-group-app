import {
  IPayloadGetGroupStructureCommunityTree,
  IPayloadGetGroupStructureMoveTargets,
  IPayloadPutGroupStructureMoveToTarget,
  IPayloadPutGroupStructureReorder,
} from '~/interfaces/IGroup';
import IBaseState from '~/store/interfaces/IBaseState';

interface IGroupStructureState extends IBaseState {
  communityTree: {
    loading: boolean,
    data: any,
  },
  reorder: {
    newOrder: any,
    loading: boolean,
  },
  move: {
    loading: boolean,
    key: '',
    targetGroups: any,
    movingGroup: any,
    selecting: any,
  },

  actions?: {
    setGroupStructureMoveSelecting?: (payload: any) => void;
    setGroupStructureMove?: (payload?: any) => void;
    setGroupStructureReorder?: (payload?: any) => void;
    getGroupStructureCommunityTree?: (payload: IPayloadGetGroupStructureCommunityTree) => void;
    getGroupStructureMoveTargets?: (payload: IPayloadGetGroupStructureMoveTargets) => void;
    putGroupStructureMoveToTarget?: (payload: IPayloadPutGroupStructureMoveToTarget) => void;
    putGroupStructureReorder?: (payload: IPayloadPutGroupStructureReorder) => void;
  },
}

export default IGroupStructureState;
