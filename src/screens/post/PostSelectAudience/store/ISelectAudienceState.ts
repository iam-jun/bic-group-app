interface ISelectAudienceState {
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

  dispatchGetAudienceTree?: () => void;
  dispatchGetAudienceSearch?: (key: string) => void;
  reset?: () => void;
}

export default ISelectAudienceState;
