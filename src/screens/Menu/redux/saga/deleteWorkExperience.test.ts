import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {cleanup} from '@testing-library/react-native';

import deleteWorkExperience from './deleteWorkExperience';
import menuActions from '../actions';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {mapWorkExperience} from '../helper';
import modalActions from '~/store/modal/actions';

afterEach(cleanup);

describe('Delete Work Experience Saga', () => {
  const action = {
    type: 'test',

    payload: {
      id: 1,
    },
  };

  it('should request to delete user work experience successfully', () => {
    const expectData = {
      code: 200,
      data: [
        {
          id: 2,
          company: 'test 1',
          currently_work_here: true,
          description: '',
          end_date: null,
          location: 'test 1',
          start_date: '2022-03-07T07:58:05.436Z',
          title_position: 'test 1',
        },
      ],
      meta: {},
    };

    // @ts-ignorets
    return expectSaga(deleteWorkExperience, action)
      .provide([
        [matchers.call.fn(menuDataHelper.deleteWorkExperience), expectData],
      ])
      .put(menuActions.setMyWorkExperience(mapWorkExperience(expectData.data)))
      .run();
  });

  it('should request to delete user work experience successfully with callback', () => {
    const expectData = {
      code: 200,
      data: [
        {
          id: 2,
          company: 'test 1',
          currently_work_here: true,
          description: '',
          end_date: null,
          location: 'test 1',
          start_date: '2022-03-07T07:58:05.436Z',
          title_position: 'test 1',
        },
      ],
      meta: {},
    };

    // @ts-ignorets
    return expectSaga(deleteWorkExperience, {
      ...action,
      callback: () => {
        console.log('callback');
      },
    })
      .provide([
        [matchers.call.fn(menuDataHelper.deleteWorkExperience), expectData],
      ])
      .put(menuActions.setMyWorkExperience(mapWorkExperience(expectData.data)))
      .run();
  });

  it('should request to delete user work experience failure', () => {
    const error = {
      meta: {message: 'Something went wrong'},
    };

    // @ts-ignorets
    return expectSaga(deleteWorkExperience, action)
      .provide([
        [
          matchers.call.fn(menuDataHelper.deleteWorkExperience),
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
