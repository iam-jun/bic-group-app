import {IObject} from '~/interfaces/common';
import {
  GET_DATA,
  SET_DATA,
  RESET,
  SET_EXTRA_DATA,
  MERGE_EXTRA_DATA,
  CREATE_ITEM,
  CREATE_ITEM_SUCCESS,
  DELETE_ITEM,
  DELETE_ITEM_SUCCESS,
  UPDATE_ITEM,
  UPDATE_ITEM_SUCCESS,
  REFRESH,
  GET_DATA_FAIL,
} from './constants';
import {AxiosRequestConfig} from 'axios';

const getData = (
  dataType: string,
  listType: string,
  params?: IObject<any>,
  config?: AxiosRequestConfig,
) => ({
  type: GET_DATA,
  dataType,
  listType,
  params,
  config,
});

const setData = (dataType: string, data: IObject<any>[]) => ({
  type: SET_DATA,
  dataType,
  data,
});

const getDataFail = (dataType: string) => ({
  type: GET_DATA_FAIL,
  dataType,
});

const createItem = (dataType: string, body: IObject<any>) => ({
  type: CREATE_ITEM,
  dataType,
  body,
});

const createItemSuccess = (dataType: string, data: IObject<any>) => ({
  type: CREATE_ITEM_SUCCESS,
  dataType,
  data,
});

const deleteItem = (dataType: string, id: string | number) => ({
  type: DELETE_ITEM,
  dataType,
  id,
});

const deleteItemSuccess = (dataType: string, id: string | number) => ({
  type: DELETE_ITEM_SUCCESS,
  dataType,
  id,
});

const updateItem = (
  dataType: string,
  id: string | number,
  body: IObject<any>,
) => ({
  type: UPDATE_ITEM,
  dataType,
  id,
  body,
});

const updateItemSuccess = (
  dataType: string,
  id: string,
  data: IObject<any>,
) => ({
  type: UPDATE_ITEM_SUCCESS,
  dataType,
  id,
  data,
});

const setExtraData = (dataType: string, data: IObject<any>[]) => ({
  type: SET_EXTRA_DATA,
  dataType,
  data,
});

const mergeExtraData = (
  dataType: string,
  listType: string,
  params?: IObject<any>,
) => ({
  type: MERGE_EXTRA_DATA,
  dataType,
  listType,
  params,
});

const reset = (dataType: string) => ({
  type: RESET,
  dataType,
});

const refresh = (
  dataType: string,
  listType: string,
  params?: IObject<any>,
  config?: AxiosRequestConfig,
) => ({
  type: REFRESH,
  dataType,
  listType,
  params,
  config,
});

export default {
  getData,
  setData,
  getDataFail,
  createItem,
  createItemSuccess,
  deleteItem,
  deleteItemSuccess,
  updateItem,
  updateItemSuccess,
  setExtraData,
  mergeExtraData,
  reset,
  refresh,
};
