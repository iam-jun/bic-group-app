import {expectSaga} from 'redux-saga-test-plan';
import saga from './saga';

describe('Search Post Saga', () => {
  it('just works!', () => {
    return (
      expectSaga(saga)
        // Assert that the `put` will eventually happen.
        .put({
          type: 'mention_input/SET_DATA',
          payload: [{username: 'test', name: 'test'}],
        })

        // Start the test. Returns a Promise.
        .run()
    );
  });
});
