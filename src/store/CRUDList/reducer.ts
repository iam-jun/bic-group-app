import CRUDlist from '~/configs/CRUDList';
import {
  CREATE_ITEM,
  CREATE_ITEM_SUCCESS,
  DELETE_ITEM_SUCCESS,
  GET_DATA,
  GET_DATA_FAIL,
  MERGE_EXTRA_DATA,
  REFRESH,
  RESET,
  SET_DATA,
  SET_EXTRA_DATA,
  UPDATE_ITEM,
  UPDATE_ITEM_SUCCESS,
} from './constants';

const listDataInitialState = {
  data: [],
  loading: false,
  refreshing: false,
  loadingMore: false,
  extra: [],
  page: 1,
  canLoadMore: true,
  path: null,
};

const createListState = () => {
  let list = {};
  Object.keys(CRUDlist).forEach(key => {
    list[key] = listDataInitialState;
  });
  return list;
};

const initialState = {
  list: createListState(),
  pageSize: 10,
};

const reducer = (state = initialState, action: any = {}) => {
  const {type, dataType} = action;
  if (!dataType) return state;

  const {list, pageSize} = state;
  const data = list[dataType];
  console.log({action, dataType, list, data});

  const {page} = data;

  switch (type) {
    case GET_DATA:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            path: action.path,
            loading: data.data.length === 0 && !data.refreshing,
            loadingMore: data.data.length > 0 && !data.refreshing,
          },
        },
      };
    case SET_DATA:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            data: action.data,
            canLoadMore: action.data.length === pageSize,
            page: page + 1,
            loading: false,
            loadingMore: false,
            refreshing: false,
          },
        },
      };
    case GET_DATA_FAIL:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            loading: false,
            refreshing: false,
            loadingMore: false,
          },
        },
      };
    case SET_EXTRA_DATA:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            extra: action.data,
            canLoadMore: action.data.length === pageSize,
            page: page + 1,
            loading: false,
            refreshing: false,
            loadingMore: false,
          },
        },
      };
    case MERGE_EXTRA_DATA:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            data: [...data.data, ...data.extra],
            extra: [],
          },
        },
      };
    case CREATE_ITEM:
      if (!action.body.localId) return state;
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            data: [
              ...data.data,
              {
                ...action.body,
                isCreating: true,
              },
            ],
          },
        },
      };
    case CREATE_ITEM_SUCCESS:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            data: action.data.localId
              ? data.data.map(item =>
                  item.localId === action.data.localId
                    ? {
                        ...action.data,
                        isCreating: false,
                      }
                    : item,
                )
              : [...data.data, action.data],
          },
        },
      };
    case UPDATE_ITEM:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            data: data.data.map(item =>
              item.id === action.body.id
                ? {
                    ...action.body,
                    isCreating: true,
                  }
                : item,
            ),
          },
        },
      };
    case UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            data: data.data.map(item =>
              item.id === action.id
                ? {
                    ...item,
                    ...action.data,
                    isCreating: false,
                  }
                : item,
            ),
          },
        },
      };
    case DELETE_ITEM_SUCCESS:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...data,
            data: data.data.filter(item => item.id !== action.id),
          },
        },
      };
    case REFRESH:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: {
            ...listDataInitialState,
            refreshing: true,
            data: data.data,
          },
        },
      };
    case RESET:
      return {
        ...state,
        list: {
          ...list,
          [dataType]: listDataInitialState,
        },
      };
    default:
      return state;
  }
};

export default reducer;
