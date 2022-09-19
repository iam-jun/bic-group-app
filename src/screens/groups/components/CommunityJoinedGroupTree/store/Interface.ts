import { IGroup } from '~/interfaces/IGroup';
import IBaseStore from '~/store/interfaces/IBaseStore';

interface IJoinedGroupTreeState extends IBaseStore {
  data: {[key: string]: IGroup},
  loading: boolean,

  getJoinedGroupTree: any
}

export default IJoinedGroupTreeState;
