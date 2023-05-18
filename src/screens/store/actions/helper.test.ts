import { handleNewOwnReaction2 } from './helper';

describe('helper useCommonController', () => {
  it('should replace item success', () => {
    const newOwnReaction2 = [{ reactionName: 'test', reactionId: '1' }];
    const response = {
      data: {
        reactionName: 'test',
        reactionId: '2',
      },
    };

    const fn = handleNewOwnReaction2({ newOwnReaction2, response });
    expect(fn).toEqual([{ ...response.data }]);
  });
});
