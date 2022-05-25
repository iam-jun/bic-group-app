import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {POST_DETAIL} from '~/test/mock_data/post';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import modalActions from '~/store/modal/actions';
import {throwError} from 'redux-saga-test-plan/providers';
import deleteReactToPost from './deleteReactToPost';
import {IPayloadReactToComment, IPayloadReactToPost} from '~/interfaces/IPost';

describe('Delete React To Post Saga', () => {
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {
      post: {
        allPosts: {
          28: {
            ...POST_DETAIL,
          },
        },
      },
    };
  });

  function allPostReducer(state = storeData, action: {type: string}) {
    if (action.type === 'test') {
      return {
        ...state,
      };
    }

    return state;
  }

  it('call server delete react to post success then go back', () => {
    const payload: IPayloadReactToPost = {
      id: 28,
      reactionId: 'wink',
      reactionCounts: POST_DETAIL.reactionsCount,
      ownReaction: POST_DETAIL.ownerReactions,
    };
    const action = {type: 'test', payload};

    const newPost = {
      ...POST_DETAIL,
      ownerReactions: [],
      reactionsCount: {
        '0': {
          wink: 0,
        },
        '1': {
          thinking_face: 1,
        },
      },
    };

    const response = {data: {}, meta: {message: 'OK'}};

    return expectSaga(deleteReactToPost, action)
      .withReducer(allPostReducer)
      .put(postActions.addToAllPosts({data: newPost as any}))
      .provide([[matchers.call.fn(postDataHelper.deleteReaction), response]])
      .run();
  });

  it('do nothing when can not find react', () => {
    const payload: IPayloadReactToPost = {
      id: 28,
      reactionId: 'test',
      reactionCounts: {},
      ownReaction: [],
    };
    const action = {type: 'test', payload};
    return expectSaga(deleteReactToPost, action)
      .withState(storeData)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('call server edit post failed', () => {
    const payload: IPayloadReactToPost = {
      id: 28,
      reactionId: 'wink',
      reactionCounts: POST_DETAIL.reactionsCount,
      ownReaction: POST_DETAIL.ownerReactions,
    };
    const action = {type: 'test', payload};

    const newPost = {
      ...POST_DETAIL,
      ownerReactions: [],
      reactionsCount: {
        '0': {
          wink: 0,
        },
        '1': {
          thinking_face: 1,
        },
      },
    };

    return expectSaga(deleteReactToPost, action)
      .withReducer(allPostReducer)
      .put(postActions.addToAllPosts({data: newPost as any}))
      .provide([
        [
          matchers.call.fn(postDataHelper.deleteReaction),
          throwError(new Error('empty data')),
        ],
      ])
      .put(postActions.addToAllPosts({data: POST_DETAIL as any}))
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: {
            textProps: {useI18n: true},
            type: 'error',
          },
        }),
      )
      .run();
  });
});
