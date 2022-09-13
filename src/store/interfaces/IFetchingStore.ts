interface IFetchingStore {
  loading?: boolean;
  hasNextPage?: boolean,
  refreshing?: boolean
}

export default IFetchingStore;
