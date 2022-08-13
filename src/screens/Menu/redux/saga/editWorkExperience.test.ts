/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { cleanup } from '@testing-library/react-native';

import editWorkExperience from './editWorkExperience';
import menuActions from '../actions';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import modalActions from '~/store/modal/actions';

afterEach(cleanup);

describe('Edit Work Experience Saga', () => {
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
    payload: {
      id: 1,
      payload: workItem,
    },
  };

  it('should request to edit user work experience successfully', () => {
    const expectData = {
      code: 200,
      data: [
        {
          id: 2,
          company: 'test 1',
          currentlyWorkHere: true,
          description: '',
          endDate: null,
          location: 'test 1',
          startDate: '2022-03-07T07:58:05.436Z',
          titlePosition: 'test 1',
        },
      ],
      meta: {},
    };

    // @ts-ignorets
    return expectSaga(editWorkExperience, action)
      .provide([
        [matchers.call.fn(menuDataHelper.editWorkExperience), expectData],
      ])
      .put(menuActions.getMyWorkExperience())
      .run();
  });

  it('should request to edit user work experience successfully with callback', () => {
    const expectData = {
      code: 200,
      data: [
        {
          id: 2,
          company: 'test 1',
          currentlyWorkHere: true,
          description: '',
          endDate: null,
          location: 'test 1',
          startDate: '2022-03-07T07:58:05.436Z',
          titlePosition: 'test 1',
        },
      ],
      meta: {},
    };

    // @ts-ignorets
    return expectSaga(editWorkExperience, {
      ...action,
      callback: () => {
        // console.log('callback');
      },
    })
      .provide([
        [matchers.call.fn(menuDataHelper.editWorkExperience), expectData],
      ])
      .put(menuActions.getMyWorkExperience())
      .run();
  });

  it('should request to edit user work experience failure', () => {
    const error = {
      meta: { message: 'Something went wrong' },
    };

    // @ts-ignorets
    return expectSaga(editWorkExperience, action)
      .provide([
        [
          matchers.call.fn(menuDataHelper.editWorkExperience),
          Promise.reject(error),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: error.meta.message,

          props: {
            textProps: { useI18n: true },

            type: 'error',
          },
        }),
      )
      .run();
  });
});
