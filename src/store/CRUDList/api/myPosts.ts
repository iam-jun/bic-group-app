import {AxiosRequestConfig} from 'axios';
import withQuery from 'with-query';
import apiEndPoints from '~/constants/apiEndPoints';
import {IObject} from '~/interfaces/common';
import baseAPI from '~/utils/baseAPI';

export const getData = (params: IObject<any>, config?: AxiosRequestConfig) => {
  return baseAPI.get(withQuery(apiEndPoints.comment, params), config);
};

export const createItem = (
  body?: IObject<any>,
  config?: AxiosRequestConfig,
) => {};

export const updateItem = (
  body: IObject<any>,
  config?: AxiosRequestConfig,
) => {};

export const deleteItem = (
  body: IObject<any>,
  config?: AxiosRequestConfig,
) => {};
