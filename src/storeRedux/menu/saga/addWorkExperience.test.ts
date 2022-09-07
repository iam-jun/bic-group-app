import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { cleanup } from '@testing-library/react-native';

import addWorkExperience from './addWorkExperience';
import menuActions from '../actions';
import modalActions from '../../modal/actions';
import groupApi from '../../../api/GroupApi';

afterEach(cleanup);

describe('Add Work Experience Saga', () => {
  const workItem = {
    company: 'test 1',
    currentlyWorkHere: true,
    description: '',
    endDate: null,
    location: 'test 1',
    startDate: '2022-03-07T07:58:05.436Z',
    titlePosition: 'test 1',
  };

  const action = {
    type: 'test',
    payload: workItem,
  };

  it('should request to add user work experience successfully', () => {
    const expectWorkItem = {
      ...workItem,
      currentlyWorkHere: true,
      endDate: null,
      id: 77,
      startDate: '2022-03-07T07:58:05.436Z',
      titlePosition: 'test 1',
    };
    const expectData = {
      code: 200,
      data: [expectWorkItem],
      meta: {},
    };

    return expectSaga(addWorkExperience, action)
      .provide([
        [matchers.call.fn(groupApi.addWorkExperience), expectData],
      ])
      .put(menuActions.getMyWorkExperience())
      .run();
  });

  it('should request to add user work experience successfully with callback', () => {
    const expectWorkItem = {
      ...workItem,
      currentlyWorkHere: true,
      endDate: null,
      id: 77,
      startDate: '2022-03-07T07:58:05.436Z',
      titlePosition: 'test 1',
    };
    const expectData = {
      code: 200,
      data: [expectWorkItem],
      meta: {},
    };

    return expectSaga(addWorkExperience, {
      ...action,
      callback: () => {
        // console.log('callback');
      },
    })
      .provide([
        [matchers.call.fn(groupApi.addWorkExperience), expectData],
      ])
      .put(menuActions.getMyWorkExperience())
      .run();
  });

  it('should request to add user work experience failure', () => {
    const error = {
      code: 10000,
      data: null,
      meta: {
        errors: [
          {
            message: 'endDate must be a valid ISO 8601 date string',
            title: 'Bad Request',
          },
        ],
        message: 'Bad Request',
      },
    };

    return expectSaga(addWorkExperience, action)
      .provide([
        [
          matchers.call.fn(groupApi.addWorkExperience),
          Promise.reject(error),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: error.meta.errors[0].message,
          props: { type: 'error' },
        }),
      )
      .run();
  });
});
