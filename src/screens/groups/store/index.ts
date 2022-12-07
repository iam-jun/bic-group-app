import { IGroupDetailEdit } from '~/interfaces/IGroup';
import {
  createStore,
} from '~/store/utils';
import assignGroupAdmin from './actions/assignGroupAdmin';
import editGroupDetail from './actions/editGroupDetail';
import revokeGroupAdmin from './actions/revokeGroupAdmin';

interface IGroupController {
  actions: {
    assignGroupAdmin: (groupId: string, userIds: string[]) => void;
    revokeGroupAdmin: (groupId: string, userId: string) => void;
    editGroupDetail: (
      data: IGroupDetailEdit,
      editFieldName?: string,
      callback?: () => void,
  ) => void;
  }
}

const groupController = (set, get) => ({
  actions: {
    assignGroupAdmin: assignGroupAdmin(set, get),
    revokeGroupAdmin: revokeGroupAdmin(set, get),
    editGroupDetail: editGroupDetail(set, get),
  },
});

const useGroupController = createStore<IGroupController>(groupController);

export default useGroupController;
