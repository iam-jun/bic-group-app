import { DeepLinkTypes } from '~/utils/link';

export default [
  {
    url: '',
    result: null,
  },
  {
    url: 'https://www.beincom.io/',
    result: {
      type: DeepLinkTypes.APP,
    },
  },
  {
    url: 'bicdev:///test/123',
    result: {
      type: DeepLinkTypes.APP,
    },
  },
  {
    url: 'bicdev:///posts/99ca53ec-5195-4e28-9506-c0f602e1becb',
    result: {
      type: DeepLinkTypes.POST_DETAIL,
      postId: '99ca53ec-5195-4e28-9506-c0f602e1becb',
    },
  },
  {
    url: 'bicdev:///posts/99ca53ec-5195-4e28-9506-c0f602e1becb?comment_id=99ca53ec-5195-4e28-9506-c0f602e1becb',
    result: {
      type: DeepLinkTypes.COMMENT_DETAIL,
      postId: '99ca53ec-5195-4e28-9506-c0f602e1becb',
      params: { commentId: '99ca53ec-5195-4e28-9506-c0f602e1becb' },
    },
  },
  {
    url: 'bicdev:///communities/99ca53ec-5195-4e28-9506-c0f602e1becb',
    result: {
      type: DeepLinkTypes.COMMUNTY_DETAIL,
      communityId: '99ca53ec-5195-4e28-9506-c0f602e1becb',
    },
  },
  {
    url: 'bicdev:///communities/99ca53ec-5195-4e28-9506-c0f602e1becb/groups/99ca53ec-5195-4e28-9506-c0f602e1becb',
    result: {
      type: DeepLinkTypes.GROUP_DETAIL,
      communityId: '99ca53ec-5195-4e28-9506-c0f602e1becb',
      groupId: '99ca53ec-5195-4e28-9506-c0f602e1becb',
    },
  },
  {
    url: 'bicdev:///series/99ca53ec-5195-4e28-9506-c0f602e1becb',
    result: {
      type: DeepLinkTypes.SERIES_DETAIL,
      seriesId: '99ca53ec-5195-4e28-9506-c0f602e1becb',
    },
  },
  {
    url: 'bicdev:///article/99ca53ec-5195-4e28-9506-c0f602e1becb',
    result: {
      type: DeepLinkTypes.ARTICLE_DETAIL,
      articleId: '99ca53ec-5195-4e28-9506-c0f602e1becb',
    },
  },
  {
    url: 'bicdev:///confirm-user?username=abc',
    result: {
      type: DeepLinkTypes.CONFIRM_USER,
      params: {
        username: 'abc',
      },
    },
  },
];
