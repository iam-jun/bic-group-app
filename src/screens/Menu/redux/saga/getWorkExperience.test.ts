import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {cleanup} from '@testing-library/react-native';

import getWorkExperience from './getWorkExperience';
import menuActions from '../actions';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {mapWorkExperience} from '../helper';

afterEach(cleanup);

describe('Get User Work Experience Saga', () => {
  const action = {
    type: 'test',

    payload: {id: 58},
  };

  const workItem = {
    company: 'test 1',
    currentlyWorkHere: true,
    currently_work_here: true,
    description: '',
    endDate: null,
    end_date: null,
    id: 77,
    location: 'test 1',
    startDate: '2022-03-07T07:58:05.436Z',
    start_date: '2022-03-07T07:58:05.436Z',
    titlePosition: 'test 1',
    title_position: 'test 1',
  };

  it('should request to get user work experience successfully', () => {
    const expectData = {
      code: 200,
      data: [workItem],
      meta: {},
    };

    // @ts-ignorets

    return expectSaga(getWorkExperience, action)
      .provide([
        [matchers.call.fn(menuDataHelper.getWorkExperience), expectData],
      ])
      .put(
        menuActions.setUserWorkExperience(mapWorkExperience(expectData.data)),
      )
      .run();
  });

  it('should request to get user work experience failure', () => {
    const error = {
      meta: {message: 'Something went wrong'},
    };

    // @ts-ignorets

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
