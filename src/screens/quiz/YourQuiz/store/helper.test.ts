import { ContentQuiz } from '~/interfaces/IQuiz';
import { PostType } from '~/interfaces/IPost';
import { getParamsTypeContentQuiz } from './helper';

describe('getParamsTypeContentQuiz function', () => {
  it('given contentFilter = ContentQuiz.ALL should return undefined', () => {
    expect(getParamsTypeContentQuiz(ContentQuiz.ALL)).toBeUndefined();
  });

  it('given contentFilter = ContentQuiz.ARTICLE should return PostType.ARTICLE', () => {
    expect(getParamsTypeContentQuiz(ContentQuiz.ARTICLE)).toBe(PostType.ARTICLE);
  });

  it('given contentFilter = ContentQuiz.POST should return PostType.POST', () => {
    expect(getParamsTypeContentQuiz(ContentQuiz.POST)).toBe(PostType.POST);
  });
});
