/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { cleanup } from '@testing-library/react-native';

import getWorkExperience from './getWorkExperience';
import menuActions from '../actions';
import menuDataHelper from '../../../screens/Menu/helper/MenuDataHelper';
import { mapWorkExperience } from '../helper';

afterEach(cleanup);

describe('Get User Work Experience Saga', () => {
  const action = {
    type: 'test',

    payload: { payload: 58 },
  };

  const workItem = {
    company: 'test 1',
    currentlyWorkHere: true,
    description: '',
    endDate: null,
    id: 77,
    location: 'test 1',
    startDate: '2022-03-07T07:58:05.436Z',
    titlePosition: 'test 1',
  };

  it('should request to get user work experience successfully', () => {
    const expectData = {
      code: 200,
      data: [workItem],
      meta: {},
    };

    // @ts-ignore
    return expectSaga(getWorkExperience, action)
      .provide([
        [matchers.call.fn(menuDataHelper.getWorkExperience), expectData],
      ])
      .put(
        // @ts-ignore
        menuActions.setUserWorkExperience(mapWorkExperience(expectData.data)),
      )
      .run();
  });

  it('should request to get user work experience failure', () => {
    const error = {
      meta: { message: 'Something went wrong' },
    };

    // @ts-ignore
    return expectSaga(getWorkExperience, action)
      .provide([
        [
          matchers.call.fn(menuDataHelper.getWorkExperience),
          Promise.reject(error),
        ],
      ])
      .run();
  });
});
