interface IFetchingState {
  loading?: boolean;
  hasNextPage?: boolean,
  refreshing?: boolean
}

export interface Pagination {
  startCursor?: string | null;
  endCursor?: string | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export default IFetchingState;
