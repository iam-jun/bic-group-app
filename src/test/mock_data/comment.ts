export const mockResponseEditComment = {
  code: 'api.ok',
  data: {
    edited: true,
    total_reply: 0,
    owner_reactions: [],
    id: 'b2e43944-a8fb-4743-bd5d-c820864e1add',
    actor: {
      id: 'a0143446-0e51-4903-b280-8c794d470903', username: 'thuquyen', fullname: 'Nguyen Thi Thu Quyền', email: 'thuquyen@tgm.vn', avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/cefa4fe5-0b45-445d-9322-ec3e4d85a325.jpg',
    },
    parent_id: '00000000-0000-0000-0000-000000000000',
    post_id: 'fc99d017-ed67-49bc-8a01-c98d8c80900a',
    content: 'Doooo @bigguyyy hiiiiiiiii :bic_hugging_face: ',
    giphy_id: null,
    created_at: '2023-03-09T02:54:23.619Z',
    updated_at: '2023-03-09T03:06:41.190Z',
    created_by: 'a0143446-0e51-4903-b280-8c794d470903',
    media: { videos: [], images: [], files: [] },
    reactions_count: {},
    mentions: [],
    child: {
      list: [],
      meta: {
        limit: 25, offset: 0, has_next_page: false, has_previous_page: false,
      },
    },
  },
  meta: { message: 'Update comment successfully' },
};

export const mockComment = {
  actor: {
    avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/cefa4fe5-0b45-445d-9322-ec3e4d85a325.jpg', email: 'thuquyen@tgm.vn', fullname: 'Nguyen Thi Thu Quyền', id: 'a0143446-0e51-4903-b280-8c794d470903', username: 'thuquyen',
  },
  child: {
    list: [],
    meta: {
      hasNextPage: false, hasPreviousPage: false, limit: 10, offset: 0,
    },
  },
  content: 'Doooo @bigguyyy hiiiiiiiii',
  createdAt: '2023-03-09T02:54:23.619Z',
  createdBy: 'a0143446-0e51-4903-b280-8c794d470903',
  edited: true,
  giphyId: null,
  giphyUrl: null,
  id: 'b2e43944-a8fb-4743-bd5d-c820864e1add',
  media: { files: [], images: [], videos: [] },
  mentions: [],
  ownerReactions: [
    {
      id: 'd1255c98-1941-4139-8dc3-5fa9a3a92adb',
      reactionName: 'bic_direct_hit',
      created_at: '2023-04-11T07:21:43.686Z',
    },
    {
      id: 'd6760356-47d1-4720-a053-b4455137f81b',
      reactionName: 'bic_flying_rocket',
      created_at: '2023-04-11T07:21:40.366Z',
    },
    {
      id: 'c77317f9-4d91-4ea1-b6a3-cc5ed9ff2d37',
      reactionName: 'stuck_out_tongue_winking_eye',
      created_at: '2023-04-11T07:21:47.002Z',
    },
  ],
  parentId: '00000000-0000-0000-0000-000000000000',
  postId: 'fc99d017-ed67-49bc-8a01-c98d8c80900a',
  reactionsCount: [
    {
      bic_flying_rocket: 1,
    },
    {
      bic_direct_hit: 1,
    },
    {
      stuck_out_tongue_winking_eye: 1,
    },
  ],
  totalReply: 0,
  updatedAt: '2023-03-09T02:54:48.011Z',
};
