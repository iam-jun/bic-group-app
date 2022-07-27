import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {cleanup} from '@testing-library/react-native';

import getMyWorkExperience from './getMyWorkExperience';
import menuActions from '../actions';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {mapWorkExperience} from '../helper';

afterEach(cleanup);

describe('Get My Work Experience Saga', () => {
  const action = {
    type: 'test',

    payload: {},
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

    // @ts-ignorets
    return expectSaga(getMyWorkExperience, action)
      .provide([
        [matchers.call.fn(menuDataHelper.getMyWorkExperience), expectData],
      ])
      .put(menuActions.setMyWorkExperience(mapWorkExperience(expectData.data)))
      .run();
  });

  it('should request to get user work experience failure', () => {
    const error = {
      meta: {message: 'Something went wrong'},
    };

    // @ts-ignorets
    return expectSaga(getMyWorkExperience, action)
      .provide([
        [
          matchers.call.fn(menuDataHelper.getMyWorkExperience),
          Promise.reject(error),
        ],
      ])
      .run();
  });
});
