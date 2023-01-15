import { PostType } from '~/interfaces/IPost';
import { getTitle, replacePostDetail } from './helper';

describe('CommentDetail helper', () => {
  it('should title is article', () => {
    const type = PostType.ARTICLE;
    const fn = getTitle(type);
    expect(fn).toEqual('post:title_comment_detail_of_article');
  });

  it('should title is post', () => {
    const type = PostType.POST;
    const fn = getTitle(type);
    expect(fn).toEqual('post:title_comment_detail_of_post');
  });

  it('should replace is article detail', () => {
    const type = PostType.ARTICLE;
    const postId = '1';
    const fn = replacePostDetail(type, postId);
    expect(fn).toBeUndefined();
  });

  it('should replace is post detail', () => {
    const type = PostType.POST;
    const postId = '1';
    const fn = replacePostDetail(type, postId);
    expect(fn).toBeUndefined();
  });
});
