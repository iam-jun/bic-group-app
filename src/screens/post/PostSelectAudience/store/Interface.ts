import IBaseState from '~/store/interfaces/IBaseState';

interface ISelectAudienceState extends IBaseState {
  tree: {
    data: undefined,
    loading: boolean,
  },
  search: {
    key: string,
    data: undefined,
    loading: boolean,
  }

  setSearch?: (payload: any) => void;

  doGetAudienceTree?: () => void;
  doGetAudienceSearch?: (key: string) => void;
}

export default ISelectAudienceState;
