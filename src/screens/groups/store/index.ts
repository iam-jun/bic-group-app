import {
  createStore,
} from '~/store/utils';
import assignGroupAdmin from './actions/assignGroupAdmin';
import revokeGroupAdmin from './actions/revokeGroupAdmin';

interface IGroupController {
  actions: {
    assignGroupAdmin: (groupId: string, userIds: string[]) => void;
    revokeGroupAdmin: (groupId: string, userId: string) => void;
  }
}

const groupController = (set, get) => ({
  actions: {
    assignGroupAdmin: assignGroupAdmin(set, get),
    revokeGroupAdmin: revokeGroupAdmin(set, get),
  },
});

const useGroupController = createStore<IGroupController>(groupController);

export default useGroupController;
