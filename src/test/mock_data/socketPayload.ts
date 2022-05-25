import {POST_DETAIL_3} from './post';

const actorIsCreator = {
  id: 33,
  username: 'ngoclinh',
  fullname: 'Nguyễn Thị Ngọc Linh',
  avatar:
    'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
};

const actorNotIsCreator = {
  id: 3,
  username: 'phuongkhanh',
  fullname: 'Huỳnh Phương Khanh',
  avatar:
    'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
  email: 'phuongkhanh@tgm.vn',
};

//User react to their post
export const UPDATE_REACTION_TO_POST_DATA_1 = {
  ...POST_DETAIL_3,
  reactionsCount: {
    '0': {thumbsup: 1},
  },
  reactionsOfActor: [
    {
      id: 1508,
      createAt: 'abc',
      reactionName: 'thumbsup',
      actor: actorIsCreator,
    },
  ],
  reaction: {
    id: 1508,
    createAt: 'abc',
    reactionName: 'thumbsup',
    actor: actorIsCreator,
  },
};

//Other users react to the user's post
export const UPDATE_REACTION_TO_POST_DATA_2 = {
  ...POST_DETAIL_3,
  reactionsCount: {
    '0': {thumbsup: 1},
  },
  reactionsOfActor: [
    {
      id: 1508,
      createAt: 'abc',
      reactionName: 'thumbsup',
      actor: actorNotIsCreator,
    },
  ],
  reaction: {
    id: 1508,
    createAt: 'abc',
    reactionName: 'thumbsup',
    actor: actorNotIsCreator,
  },
};

//Users react to their comments
export const UPDATE_REACTION_TO_COMMENT_DATA_1 = {
  id: 490,
  actor: actorIsCreator,
  content: 'Important post',
  mentions: [],
  reactionsCount: {},
  reactionsOfActor: {},
  audience: {
    groups: [
      {
        id: 1,
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: [139, 2, 10, 152, 66, 67, 103, 2, 2],
      },
    ],
  },
  comment: {
    id: 490,
    actor: actorIsCreator,
    reaction: {
      id: 1508,
      reactionName: 'thumbsup',
      actor: actorIsCreator,
      content: 1,
      mentions: {},
      createdAt: '2022-05-25T08:17:59.366Z',
      updatedAt: '2022-05-25T08:17:59.366Z',
    },
    media: {},
    mentions: [],
    reactionsCount: {
      '0': {
        thumbsup: 1,
      },
    },
    reactionsOfActor: [
      {
        id: 1508,
        createAt: 'abc',
        reactionName: 'thumbsup',
        actor: actorIsCreator,
      },
    ],
    createdAt: '2022-05-25T08:17:59.366Z',
    updatedAt: '2022-05-25T08:17:59.366Z',
  },
  createdAt: '2022-05-25T07:35:06.092Z',
  updatedAt: '2022-05-25T07:35:06.092Z',
  event: 'reaction.has.been.created',
  target: 'COMMENT',
  verb: 'REACT',
};

//Other users react to the user's comment
export const UPDATE_REACTION_TO_COMMENT_DATA_2 = {
  ...UPDATE_REACTION_TO_COMMENT_DATA_1,
  comment: {
    ...UPDATE_REACTION_TO_COMMENT_DATA_1.comment,
    reaction: {
      id: 1508,
      reactionName: 'thumbsup',
      actor: actorNotIsCreator,
      content: 1,
      mentions: {},
      createdAt: '2022-05-25T08:17:59.366Z',
      updatedAt: '2022-05-25T08:17:59.366Z',
    },
    reactionsOfActor: [
      {
        id: 1508,
        createAt: 'abc',
        reactionName: 'thumbsup',
        actor: actorNotIsCreator,
      },
    ],
  },
};

//Users react to their child comments
export const UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1 = {
  id: 490,
  actor: actorIsCreator,
  content: 'Important post',
  mentions: [],
  reactionsCount: {},
  reactionsOfActor: {},
  audience: {
    groups: [
      {
        id: 1,
        name: 'EVOL Community',
        icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
        child: [139, 2, 10, 152, 66, 67, 103, 2, 2],
      },
    ],
  },
  comment: {
    id: 490,
    actor: actorIsCreator,
    media: {},
    mentions: [],
    createdAt: '2022-05-25T08:17:59.366Z',
    updatedAt: '2022-05-25T08:17:59.366Z',
    child: {
      id: 1450,
      actor: actorIsCreator,
      content: 'A',
      reaction: {
        id: 1508,
        reactionName: 'thumbsup',
        actor: actorIsCreator,
        content: 1,
        mentions: {},
        createdAt: '2022-05-25T08:17:59.366Z',
        updatedAt: '2022-05-25T08:17:59.366Z',
      },
      reactionsCount: {
        '0': {
          thumbsup: 1,
        },
      },
      reactionsOfActor: [
        {
          id: 1508,
          createAt: 'abc',
          reactionName: 'thumbsup',
          actor: actorIsCreator,
        },
      ],
      createdAt: '2022-05-25T09:37:30.957Z',
      updatedAt: '2022-05-25T09:37:30.957Z',
    },
  },
  createdAt: '2022-05-25T07:35:06.092Z',
  updatedAt: '2022-05-25T07:35:06.092Z',
  event: 'reaction.has.been.created',
  target: 'COMMENT',
  verb: 'REACT',
};

//Other users react to the user's child comment
export const UPDATE_REACTION_TO_CHILD_COMMENT_DATA_2 = {
  ...UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1,
  comment: {
    ...UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1.comment,
    child: {
      ...UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1.comment.child,
      actor: actorNotIsCreator,
      reaction: {
        id: 1508,
        reactionName: 'thumbsup',
        actor: actorNotIsCreator,
        content: 1,
        mentions: {},
        createdAt: '2022-05-25T08:17:59.366Z',
        updatedAt: '2022-05-25T08:17:59.366Z',
      },
      reactionsOfActor: [
        {
          id: 1508,
          createAt: 'abc',
          reactionName: 'thumbsup',
          actor: actorNotIsCreator,
        },
      ],
    },
  },
};
