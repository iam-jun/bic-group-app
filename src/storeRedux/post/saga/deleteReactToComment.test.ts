import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { COMMENT_HAS_REACTION } from '../../../test/mock_data/post';
import postDataHelper from '../../../screens/Post/helper/PostDataHelper';
import postActions from '../actions';
import modalActions from '../../modal/actions';
import deleteReactToComment from './deleteReactToComment';
import { IPayloadReactToComment } from '../../../interfaces/IPost';

describe('Delete React To Comment Saga', () => {
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {
      post: {
        allComments: {
          494: {
            ...COMMENT_HAS_REACTION,
          },
        },
      },
    };
  });

  it('call server delete react to comment success then go back', () => {
    const payload: IPayloadReactToComment = {
      id: '494',
      reactionId: 'wink',
      comment: {} as any,
      reactionsCount: COMMENT_HAS_REACTION.reactionsCount,
      ownerReactions: COMMENT_HAS_REACTION.ownerReactions as any,
    };
    const action = { type: 'test', payload };
    const response = { data: {}, meta: { message: 'OK' } };

    const newAllComments = {
      494: {
        ...COMMENT_HAS_REACTION,
        ownerReactions: [],
        reactionsCount: {
          0: {
            wink: 1,
          },
          1: {
            thinking_face: 1,
          },
          2: {
            wink: 0,
          },
          3: {
            thinking_face: 1,
          },
        },
      },
    };

    // eslint-disable-next-line default-param-last
    function allCommentsReducer(state = storeData, action: {type: string}) {
      if (action.type === 'test') {
        return {
          ...state,
        };
      }

      return state;
    }

    return expectSaga(deleteReactToComment, action)
      .provide([[matchers.call.fn(postDataHelper.deleteReaction), response]])
      .withReducer(allCommentsReducer)
      .put(postActions.setAllComments(newAllComments as any))
      .run();
  });

  it('do nothing when can not find react', () => {
    const payload: IPayloadReactToComment = {
      id: '0',
      reactionId: 'wink',
      comment: {} as any,
      reactionsCount: {},
      ownerReactions: [],
    };
    const action = { type: 'test', payload };
    return expectSaga(deleteReactToComment, action)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(0);
      });
  });

  it('call server edit post failed', () => {
    const payload: IPayloadReactToComment = {
      id: '494',
      reactionId: 'wink',
      comment: {} as any,
      reactionsCount: COMMENT_HAS_REACTION.reactionsCount,
      ownerReactions: COMMENT_HAS_REACTION.ownerReactions as any,
    };
    const action = { type: 'test', payload };

    const newAllComments = {
      494: {
        ...COMMENT_HAS_REACTION,
      },
    };
    return expectSaga(deleteReactToComment, action)
      .provide([
        [
          matchers.call.fn(postDataHelper.deleteReaction),
          throwError(new Error('empty data')),
        ],
      ])
      .withState(storeData)
      .put(postActions.setAllComments(newAllComments as any))
      .put(
        modalActions.showHideToastMessage({
          content: 'common:text_error_message',
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
