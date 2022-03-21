import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {cleanup} from '@testing-library/react-native';

import addWorkExperience from './addWorkExperience';
import menuActions from '../actions';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {mapWorkExperience} from '../helper';
import modalActions from '~/store/modal/actions';

afterEach(cleanup);

describe('Add Work Experience Saga', () => {
  const workItem = {
    company: 'test 1',
    currently_work_here: true,
    description: '',
    end_date: null,
    location: 'test 1',
    start_date: '2022-03-07T07:58:05.436Z',
    title_position: 'test 1',
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

    // @ts-ignorets
    return expectSaga(addWorkExperience, action)
      .provide([
        [matchers.call.fn(menuDataHelper.addWorkExperience), expectData],
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

    // @ts-ignorets
    return expectSaga(addWorkExperience, {
      ...action,
      callback: () => {
        console.log('callback');
      },
    })
      .provide([
        [matchers.call.fn(menuDataHelper.addWorkExperience), expectData],
      ])
      .put(menuActions.getMyWorkExperience())
      .run();
  });

  it('should request to add user work experience failure', () => {
    const error = {
      meta: {message: 'Something went wrong'},
    };

    // @ts-ignorets
    return expectSaga(addWorkExperience, action)
      .provide([
        [
          matchers.call.fn(menuDataHelper.getMyWorkExperience),
          Promise.reject(error),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: error.meta.message,

          props: {
            textProps: {useI18n: true},

            type: 'error',
          },
        }),
      )
      .run();
  });
});
