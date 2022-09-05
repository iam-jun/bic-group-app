import { IGroup } from '~/interfaces/IGroup';

interface IJoinedGroupTreeState {
  data: {[key: string]: IGroup},
  loading: boolean,

  getJoinedGroupTree: any
}

export default IJoinedGroupTreeState;
