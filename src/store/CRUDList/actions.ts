import {IObject} from '~/interfaces/common';
import {AxiosRequestConfig} from 'axios';

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

export const getData = (
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

export const setData = (dataType: string, data: IObject<any>[]) => ({
  type: SET_DATA,
  dataType,
  data,
});

export const getDataFail = (dataType: string) => ({
  type: GET_DATA_FAIL,
  dataType,
});

export const createItem = (dataType: string, body: IObject<any>) => ({
  type: CREATE_ITEM,
  dataType,
  body,
});

export const createItemSuccess = (dataType: string, data: IObject<any>) => ({
  type: CREATE_ITEM_SUCCESS,
  dataType,
  data,
});

export const deleteItem = (dataType: string, id: string | number) => ({
  type: DELETE_ITEM,
  dataType,
  id,
});

export const deleteItemSuccess = (dataType: string, id: string | number) => ({
  type: DELETE_ITEM_SUCCESS,
  dataType,
  id,
});

export const updateItem = (
  dataType: string,
  id: string | number,
  body: IObject<any>,
) => ({
  type: UPDATE_ITEM,
  dataType,
  id,
  body,
});

export const updateItemSuccess = (
  dataType: string,
  id: string,
  data: IObject<any>,
) => ({
  type: UPDATE_ITEM_SUCCESS,
  dataType,
  id,
  data,
});

export const setExtraData = (dataType: string, data: IObject<any>[]) => ({
  type: SET_EXTRA_DATA,
  dataType,
  data,
});

export const mergeExtraData = (
  dataType: string,
  listType: string,
  params?: IObject<any>,
) => ({
  type: MERGE_EXTRA_DATA,
  dataType,
  listType,
  params,
});

export const reset = (dataType: string) => ({
  type: RESET,
  dataType,
});

export const refresh = (
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
