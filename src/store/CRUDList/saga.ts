import {AxiosRequestConfig} from 'axios';
import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import api from './api';
import mock from './mock';
import actions from './actions';
import * as types from './constants';
import mapData from './map-data';
import AppConfig from '~/configs';
import {IObject} from '~/interfaces/common';

export default function* saga() {
  yield takeEvery(types.GET_DATA, getData);
  yield takeLatest(types.MERGE_EXTRA_DATA, mergeExtraData);
  yield takeEvery(types.CREATE_ITEM, createItem);
  yield takeLatest(types.UPDATE_ITEM, updateItem);
  yield takeLatest(types.DELETE_ITEM, deleteItem);
  yield takeLatest(types.REFRESH, refresh);
}

function* getData({
  dataType,
  listType,
  params,
  config,
}: {
  dataType: string;
  listType: string;
  params?: IObject<any>;
  config?: AxiosRequestConfig;
}) {
  const {CRUDList} = yield select();
  const {list, pageSize} = CRUDList;
  const data = list[dataType];
  console.log({dataType, listType, params, data});

  const {page} = data;

  if (list.isLoading) return;

  try {
    let response: IObject<any>;
    if (AppConfig.dataMode === 'mock') {
      response = yield mock[dataType as keyof typeof mock].getData();
    } else {
      response = yield call(api[dataType as keyof typeof api]?.getData, {
        ...params,
        page,
        pageSize,
      });
    }
    const mappedData = response.map((item: IObject<any>) =>
      mapData(listType, item),
    );

    if (page === 1) {
      yield put(actions.setData(dataType, mappedData));

      if (response.length === pageSize)
        yield put(actions.getData(dataType, listType, params, config));
    } else yield put(actions.setExtraData(dataType, mappedData));
  } catch (ex) {
    console.log('getData', ex);
    yield put(actions.getDataFail(dataType));
  }
}

function* mergeExtraData({
  dataType,
  listType,
  params,
  path,
}: {
  dataType: string;
  listType: string;
  params?: IObject<any>;
  path?: string;
}) {
  const {CRUDList} = yield select();
  const {list} = CRUDList;
  const data = list[dataType];

  const {canLoadMore, isLoading} = data;

  try {
    if (canLoadMore && !isLoading)
      yield put(actions.getData(dataType, listType, params));
  } catch (ex) {
    console.log('mergeExtraData', ex);
  }
}

function* createItem({
  dataType,
  body,
  path,
}: {
  dataType: string;
  body: IObject<any>;
  path: string;
}) {
  try {
    let response: IObject<any>;
    if (AppConfig.dataMode === 'mock') {
      response = yield mock[dataType as keyof typeof mock].createItem();
    } else
      response = yield call(api[dataType as keyof typeof api].createItem, body);

    yield put(actions.createItemSuccess(dataType, {...response, ...body}));
  } catch (ex) {
    console.log('createItem', ex);
  }
}

function* updateItem({
  dataType,
  id,
  body,
}: {
  dataType: string;
  id: string;
  body: IObject<any>;
}) {
  try {
    let response: IObject<any>;
    if (AppConfig.dataMode === 'mock') {
      response = yield mock[dataType as keyof typeof mock].updateItem();
    } else
      response = yield call(api[dataType as keyof typeof api].updateItem, body);
    yield put(actions.updateItemSuccess(dataType, id, response));
  } catch (ex) {
    console.log('updateItem', ex);
  }
}

function* deleteItem({
  dataType,
  id,
  config,
}: {
  dataType: string;
  id: string;
  config: AxiosRequestConfig;
}) {
  try {
    let response: IObject<any>;

    if (AppConfig.dataMode === 'mock') {
      response = yield mock[dataType as keyof typeof mock].deleteItem;
    } else
      yield call(api[dataType as keyof typeof api].deleteItem, {
        showLoading: true,
      });
    yield put(actions.deleteItemSuccess(dataType, id));
  } catch (ex) {
    console.log('deleteItem', ex);
  }
}

function* refresh({
  dataType,
  listType,
  params,
  config,
}: {
  dataType: string;
  listType: string;
  params: IObject<any>;
  config: AxiosRequestConfig;
}) {
  yield put(actions.getData(dataType, listType, params, config));
}
