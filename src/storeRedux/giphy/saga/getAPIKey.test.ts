/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../actions';
import getAPIKey from './getAPIKey';
import streamApi from "../../../api/StreamApi";

describe('Get API key saga', () => {
  it('should get API key successfully', () => {
    const action = {
      type: 'test',
    };
    const response = {
      data: 'API-Key',
    };

    return (
      // @ts-ignorets
      expectSaga(getAPIKey, action)
        .provide([[matchers.call.fn(streamApi.getGiphyAPIKey), response]])
        .put(actions.setAPIKey(response.data))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(2);
        })
    );
  });

  it('should call server and server throws an error', () => {
    const action = {
      type: 'test',
    };

    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    // @ts-ignore
    return expectSaga(getAPIKey, action)
      .provide([
        [matchers.call.fn(streamApi.getGiphyAPIKey), Promise.reject(resp)],
      ])
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
