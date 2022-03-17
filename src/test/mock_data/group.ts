import {IGroupDetail} from '~/interfaces/IGroup';

export const groupDetailData: IGroupDetail = {
  group: {
    id: 1,
    parent_id: null,
    name: 'EVOL Community',
    slug: 'evol-community-1641809088',
    description: 'The greatest community ever',
    level: 0,
    parents: null,
    owner_id: 1,
    icon: '',
    background_img_url: null,
    group_type: 'COMPANY',
    privacy: 'PUBLIC',
    chat_id: 'rpq3unai7i8ztprmoz97rdjr7w',
    created_at: '2022-01-10T10:04:48.685Z',
    updated_at: '2022-01-10T10:04:48.928Z',
    deleted_at: null,
    user_count: 25,
  },
  join_status: 2,
  can_setting: false,
  can_manage_member: false,
  total_pending_members: 0,
};

/**
 * Selecting status:
 * [ ] EVOL Community
 *  - [x] Bein Community
 *  -  - [x] Bein Product Team
 */
export const GROUP_TREE_WITH_SELECTING = {
  '1': false,
  '10': {
    id: 10,
    parent_id: 1,
    name: 'Bein Community',
    slug: '863b7fce-2a88-4441-aa24-4803f7b6d1ec-1641834908',
    description: null,
    level: 1,
    parents: [1],
    owner_id: 1,
    icon: null,
    background_img_url: null,
    group_type: 'GENERIC',
    privacy: 'PUBLIC',
    chat_id: 'nc1m1i78fpdaiktp7bdzdnntgh',
    created_at: '2022-01-10T17:15:08.123Z',
    updated_at: '2022-01-10T17:15:08.592Z',
    deleted_at: null,
    children: [],
    user_count: '19',
    uiId: 'tree_0_0',
    parentUiId: 'tree_0',
    hide: false,
    uiLevel: 1,
    isCollapsing: false,
    isChecked: true,
    childrenUiIds: ['tree_0_0_0'],
  },
  '17': {
    id: 17,
    parent_id: 10,
    name: 'Bein Product Team',
    slug: 'cd99ab19-a7bf-461b-9b0e-35f809774821-1641835298',
    description: null,
    level: 2,
    parents: [1, 10],
    owner_id: 1,
    icon: null,
    background_img_url: null,
    group_type: 'GENERIC',
    privacy: 'PUBLIC',
    chat_id: '3typp5m3b3r7byuu5q3fjqmaaa',
    created_at: '2022-01-10T17:21:38.026Z',
    updated_at: '2022-01-10T17:47:03.538Z',
    deleted_at: null,
    children: [],
    user_count: '18',
    uiId: 'tree_0_0_0',
    parentUiId: 'tree_0_0',
    hide: false,
    uiLevel: 2,
    isCollapsing: false,
    isChecked: true,
    childrenUiIds: [],
  },
};

// contains 25 data for testing
export const groupPostData = [
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'd1c2fd96-08e5-4466-9cf9-acc12dfc6a39',
    id: 'e108efd0-a3ff-11ec-8080-8000656d8642',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [],
    },
    latest_reactions_extra: {},
    mentions: {
      users: {
        undefined: {
          id: '58',
          data: {
            fullname: 'Nguyen Thi Thu Quyền',
            avatar:
              'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
          },
          created_at: '2022-01-24T08:35:18.713097Z',
          updated_at: '2022-03-14T08:19:30.365426Z',
        },
        vantest3: {
          id: '56',
          data: {
            username: 'vantest3',
            fullname: 'Van Test 3',
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          },
          created_at: '2022-01-12T09:21:27.181829Z',
          updated_at: '2022-01-12T10:04:03.646786Z',
        },
        vantest2: {
          id: '55',
          data: {
            username: 'vantest2',
            fullname: 'Van Test 2',
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          },
          created_at: '2022-01-12T09:17:16.761623Z',
          updated_at: '2022-01-12T10:04:02.697861Z',
        },
        vantest1: {
          id: '54',
          data: {
            username: 'vantest1',
            fullname: 'vantest1',
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          },
          created_at: '2022-01-12T09:14:45.827042Z',
          updated_at: '2022-01-12T10:04:01.682044Z',
        },
      },
      groups: {},
    },
    object: {
      id: '671defe7-5fba-4f0d-8b81-3bc4c35f586d',
      collection: 'post',
      foreign_id: 'post:671defe7-5fba-4f0d-8b81-3bc4c35f586d',
      data: {
        images: [],
        videos: [],
        files: [],
        content: '@thuquyen @vantest3 @vantest2 @vantest1 ',
      },
      created_at: '2022-03-15T01:33:07.259161Z',
      updated_at: '2022-03-15T01:33:12.540612Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment_count: 0,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-15T01:33:12.909000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '08097334-3c19-4d52-8eef-e586db230e22',
    id: '078db680-a3a2-11ec-8080-80017c3843d6',
    important: {
      active: false,
      expires_time: null,
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-14T14:21:42.125285Z',
          updated_at: '2022-03-14T14:21:42.125285Z',
          id: '1c4a5223-d791-416e-834d-1ba6565958f6',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '078db680-a3a2-11ec-8080-80017c3843d6',
          data: {
            content: 'Hiiii',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-14T14:21:42.161722Z',
          updated_at: '2022-03-14T14:21:42.161722Z',
          id: '36c7db39-2ee0-4fbc-8198-f08b1c2c8307',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '078db680-a3a2-11ec-8080-80017c3843d6',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      smile: [
        {
          id: 'd2876357-2ebe-426e-afcb-c71d09bf6778',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'smile',
          parent: '',
          activity_id: '078db680-a3a2-11ec-8080-80017c3843d6',
          created_at: '2022-03-14T14:21:35.962165Z',
          updated_at: '2022-03-14T14:21:35.962165Z',
        },
      ],
      smiley: [
        {
          id: 'd24351ec-ffdc-4160-af30-196d6c441bf8',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'smiley',
          parent: '',
          activity_id: '078db680-a3a2-11ec-8080-80017c3843d6',
          created_at: '2022-03-14T14:21:33.087666Z',
          updated_at: '2022-03-14T14:21:33.087666Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '072df46b-593f-4392-b43b-9bc960e71b65',
      collection: 'post',
      foreign_id: 'post:072df46b-593f-4392-b43b-9bc960e71b65',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Hello world @vansugoi @vantest3 ',
      },
      created_at: '2022-03-14T14:21:15.281013Z',
      updated_at: '2022-03-15T00:32:59.133673Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 1,
      comment_count: 1,
      smile: 1,
      smiley: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-14T14:21:24.840000',
    type: 'post',
    verb: 'post',
    reactions_order: ['smiley', 'smile'],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '48e9feb3-f0b3-450f-a7de-afc6c6bb538b',
    id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
    important: {
      active: false,
      expires_time: null,
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-14T08:27:32.959703Z',
          updated_at: '2022-03-14T08:27:32.959703Z',
          id: '0a093e4a-6a11-4fe9-93e2-7b0b77585c70',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
          data: {
            content: '2',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-14T08:27:42.696492Z',
                updated_at: '2022-03-14T08:27:42.696492Z',
                id: '4c30c478-4027-41bf-92d9-3b7e968444b4',
                user_id: '2',
                user: {
                  created_at: '2022-01-10T03:45:06.563478Z',
                  updated_at: '2022-02-28T07:49:26.224174Z',
                  id: '2',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
                    fullname: 'Trần Nam Anh',
                  },
                },
                kind: 'comment',
                activity_id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
                data: {
                  content: '2.2',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '0a093e4a-6a11-4fe9-93e2-7b0b77585c70',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-14T08:27:28.534867Z',
          updated_at: '2022-03-14T08:27:28.534867Z',
          id: '28a56551-772a-4472-8531-fff537e6e7b2',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-14T08:27:42.816818Z',
          updated_at: '2022-03-14T08:27:42.816818Z',
          id: '0a9cce82-eef3-4834-aef2-d84484b0145d',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-14T08:27:32.996934Z',
          updated_at: '2022-03-14T08:27:32.996934Z',
          id: 'aa46c105-7100-449e-8a78-128730e795da',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-14T08:27:28.714143Z',
          updated_at: '2022-03-14T08:27:28.714143Z',
          id: 'fa98cb7d-bd7c-4c2b-a12c-ed27debc92d9',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      grinning: [
        {
          id: 'b284c203-8790-4be6-888c-de85174ad62d',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'grinning',
          parent: '',
          activity_id: 'c13c4330-a361-11ec-8080-80001d88e1bb',
          created_at: '2022-03-14T08:27:22.981774Z',
          updated_at: '2022-03-14T08:27:22.981774Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '9fcee0f2-9457-4e92-9463-dd59cd975950',
      collection: 'post',
      foreign_id: 'post:9fcee0f2-9457-4e92-9463-dd59cd975950',
      data: {
        images: [],
        videos: [],
        files: [],
        content: '@dphidang  de @vantest3 @thuquyen ',
      },
      created_at: '2022-03-14T06:40:15.88028Z',
      updated_at: '2022-03-15T00:38:13.536367Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 2,
      comment_count: 3,
      grinning: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-14T06:41:19.075000',
    type: 'post',
    verb: 'post',
    reactions_order: ['grinning'],
  },
  {
    actor: {
      created_at: '2022-01-11T02:46:10.540203Z',
      updated_at: '2022-03-14T10:59:10.736036Z',
      id: '33',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        fullname: 'Nguyễn Thị Ngọc Linh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'df328e9a-9f03-4fbd-9b3d-d2eb6f8cbd3a',
    id: '1535a120-a065-11ec-8080-800177b22ffb',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      blush: [
        {
          id: '283202bc-fd82-4a7a-b156-cd4b9fa75270',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'blush',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:39.113760Z',
          updated_at: '2022-03-14T04:22:39.113760Z',
        },
      ],
      comment: [
        {
          created_at: '2022-03-14T03:57:29.021712Z',
          updated_at: '2022-03-14T03:57:29.021712Z',
          id: 'b0d66016-501c-46ab-a4ef-86f69b927711',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {
            content: 'abcd',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-33'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-10T11:30:47.066922Z',
          updated_at: '2022-03-10T11:30:47.066922Z',
          id: 'baa5ca00-979b-466c-aa76-ad263be2e2ed',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {
            content: '@ngoclinh',
            edited: false,
            images: [],
            mentions: {
              users: {
                ngoclinh: {
                  id: '33',
                  data: {
                    username: 'ngoclinh',
                    fullname: 'Nguyễn Thị Ngọc Linh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                  },
                },
              },
              groups: {},
            },
          },
          target_feeds: ['notification:u-33'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-10T11:31:00.182927Z',
                updated_at: '2022-03-10T11:31:00.182927Z',
                id: 'ef56614b-1137-49a1-aa8c-ab194a2999dd',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
                data: {
                  content: 'test reply cmt mentiond',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: 'baa5ca00-979b-466c-aa76-ad263be2e2ed',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-10T11:28:01.101195Z',
          updated_at: '2022-03-10T11:28:01.101195Z',
          id: 'a5a593b5-182f-4fd7-87e8-c1c50c1a44a9',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {
            content: 'um',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-10T11:28:10.895332Z',
                updated_at: '2022-03-10T11:28:10.895332Z',
                id: '75ce16de-2f0f-4fd7-9bbb-a49b9afe4ca1',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
                data: {
                  content: '@ngoclinh ok',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-33'],
                parent: 'a5a593b5-182f-4fd7-87e8-c1c50c1a44a9',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-14T03:57:29.072274Z',
          updated_at: '2022-03-14T03:57:29.072274Z',
          id: '1c1d3cf3-b60c-4f11-a69c-ac2e3849e8a8',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:31:00.216799Z',
          updated_at: '2022-03-10T11:31:00.216799Z',
          id: '12cbbffe-f319-46e3-a5a4-fcab22bf4419',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:30:47.158008Z',
          updated_at: '2022-03-10T11:30:47.158008Z',
          id: '3f34df84-b7b2-4cbe-8156-4c5fa9c3fb71',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:28:10.975253Z',
          updated_at: '2022-03-10T11:28:10.975253Z',
          id: '44f0b587-8954-4fde-8b6e-8c753f413576',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:28:01.145351Z',
          updated_at: '2022-03-10T11:28:01.145351Z',
          id: 'a0172057-0de2-4605-be44-84a7e862ef08',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      grin: [
        {
          id: 'c3b2f60e-57be-478a-82be-5888092d1208',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'grin',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T10:57:13.678328Z',
          updated_at: '2022-03-14T10:57:13.678328Z',
        },
        {
          id: 'e6582111-7f15-4157-a3f0-33de3463d2e1',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'grin',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T03:55:50.864094Z',
          updated_at: '2022-03-14T03:55:50.864094Z',
        },
        {
          id: '008a5b98-eba6-4bf2-a0d3-c513e45863bf',
          user_id: '16',
          user: {
            id: '16',
            data: {
              fullname: 'Nguyễn Anh Thiện',
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              username: 'anhthien',
            },
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
          },
          kind: 'grin',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-10T12:28:55.494656Z',
          updated_at: '2022-03-10T12:28:55.494656Z',
        },
      ],
      grinning: [
        {
          id: 'a8f7191a-d288-45f6-84a3-a1e1010dffe8',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'grinning',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:09.272996Z',
          updated_at: '2022-03-14T04:22:09.272996Z',
        },
      ],
      grinning_face_with_star_eyes: [
        {
          id: '01b29002-e0e9-4724-8f85-2d53be09c5a7',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'grinning_face_with_star_eyes',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:49.086472Z',
          updated_at: '2022-03-14T04:22:49.086472Z',
        },
      ],
      heart_eyes: [
        {
          id: 'b6693985-f4d4-45aa-820a-b75eac6032d5',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'heart_eyes',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:46.947773Z',
          updated_at: '2022-03-14T04:22:46.947773Z',
        },
      ],
      innocent: [
        {
          id: 'ab7cabc5-1d32-4a7b-a0a4-6d01076393b6',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'innocent',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:42.574255Z',
          updated_at: '2022-03-14T04:22:42.574255Z',
        },
      ],
      kissing: [
        {
          id: 'feef01d8-e9eb-4a24-9c3f-c78fa17c9895',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'kissing',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:52.903046Z',
          updated_at: '2022-03-14T04:22:52.903046Z',
        },
      ],
      kissing_closed_eyes: [
        {
          id: '09b8e713-e77f-4762-9ee4-a72ca40d59f1',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'kissing_closed_eyes',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:55.768531Z',
          updated_at: '2022-03-14T04:22:55.768531Z',
        },
      ],
      kissing_heart: [
        {
          id: 'bed2a0e0-f785-4c5d-85f3-0f16b5c04864',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'kissing_heart',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:50.693021Z',
          updated_at: '2022-03-14T04:22:50.693021Z',
        },
      ],
      kissing_smiling_eyes: [
        {
          id: 'ef534ba3-15ba-4a8f-866d-a52b40782759',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'kissing_smiling_eyes',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:57.605785Z',
          updated_at: '2022-03-14T04:22:57.605785Z',
        },
      ],
      pleading_face: [
        {
          id: 'dbdaf624-2334-4043-9b50-95f371ceafbd',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'pleading_face',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:26:37.759914Z',
          updated_at: '2022-03-14T04:26:37.759914Z',
        },
      ],
      rolling_on_the_floor_laughing: [
        {
          id: '4742c37a-a693-47f9-b21c-d7eb9936b4ef',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'rolling_on_the_floor_laughing',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:28.510787Z',
          updated_at: '2022-03-14T04:22:28.510787Z',
        },
      ],
      satisfied: [
        {
          id: 'f9cfe8c9-e6be-4915-93a8-581b1e11d5e2',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'satisfied',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:25.071347Z',
          updated_at: '2022-03-14T04:22:25.071347Z',
        },
      ],
      slightly_smiling_face: [
        {
          id: '350f7274-f535-4874-a1bf-c090a7429d2c',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'slightly_smiling_face',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:31.848668Z',
          updated_at: '2022-03-14T04:22:31.848668Z',
        },
      ],
      smile: [
        {
          id: '85bf1cff-c8ad-41d0-8468-22618a466580',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'smile',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:17.385702Z',
          updated_at: '2022-03-14T04:22:17.385702Z',
        },
      ],
      smiley: [
        {
          id: 'efaf3d28-6313-43b9-8e4d-790c1c228dbd',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'smiley',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:15.551849Z',
          updated_at: '2022-03-14T04:22:15.551849Z',
        },
      ],
      smiling_face_with_3_hearts: [
        {
          id: '068d585d-77ef-4ad3-a6d7-8038ce43a8e2',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'smiling_face_with_3_hearts',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:44.991080Z',
          updated_at: '2022-03-14T04:22:44.991080Z',
        },
      ],
      smirk_cat: [
        {
          id: 'c5786869-fadf-42d9-b05b-cedd55aead79',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'smirk_cat',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T10:57:23.447359Z',
          updated_at: '2022-03-14T10:57:23.447359Z',
        },
      ],
      sweat_smile: [
        {
          id: 'e694c7b1-efb9-4d7f-a0ea-f691a7d51468',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'sweat_smile',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:26.887243Z',
          updated_at: '2022-03-14T04:22:26.887243Z',
        },
      ],
      upside_down_face: [
        {
          id: '5ed33c46-1fdc-4451-9f37-5b2a68ad287d',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'upside_down_face',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:33.904339Z',
          updated_at: '2022-03-14T04:22:33.904339Z',
        },
      ],
      yum: [
        {
          id: 'b75c1e16-b4e7-4c75-9524-6ba12b331286',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'yum',
          parent: '',
          activity_id: '1535a120-a065-11ec-8080-800177b22ffb',
          created_at: '2022-03-14T04:22:59.755189Z',
          updated_at: '2022-03-14T04:22:59.755189Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '95844c5e-e3bd-492a-acdb-4f758fc4310e',
      collection: 'post',
      foreign_id: 'post:95844c5e-e3bd-492a-acdb-4f758fc4310e',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'test tiếp rep comment',
      },
      created_at: '2022-03-10T11:27:27.597237Z',
      updated_at: '2022-03-10T11:27:34.581763Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      blush: 1,
      comment: 3,
      comment_count: 5,
      expressionless: 0,
      grin: 3,
      grinning: 1,
      grinning_face_with_star_eyes: 1,
      heart_eyes: 1,
      innocent: 1,
      joy: 0,
      kissing: 1,
      kissing_closed_eyes: 1,
      kissing_heart: 1,
      kissing_smiling_eyes: 1,
      pleading_face: 1,
      rolling_on_the_floor_laughing: 1,
      satisfied: 1,
      slightly_smiling_face: 1,
      smile: 1,
      smiley: 1,
      smiling_face_with_3_hearts: 1,
      smirk_cat: 1,
      sweat_smile: 1,
      upside_down_face: 1,
      wink: 0,
      yum: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-10T11:27:34.962000',
    type: 'post',
    verb: 'post',
    reactions_order: [
      'grin',
      'grinning',
      'smiley',
      'smile',
      'satisfied',
      'sweat_smile',
      'rolling_on_the_floor_laughing',
      'slightly_smiling_face',
      'upside_down_face',
      'blush',
      'innocent',
      'smiling_face_with_3_hearts',
      'heart_eyes',
      'grinning_face_with_star_eyes',
      'kissing_heart',
      'kissing',
      'kissing_closed_eyes',
      'kissing_smiling_eyes',
      'yum',
      'pleading_face',
      'smirk_cat',
    ],
  },
  {
    actor: {
      created_at: '2022-01-10T10:03:41.586970Z',
      updated_at: '2022-01-12T10:03:37.435053Z',
      id: '16',
      data: {
        avatar:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
        fullname: 'Nguyễn Anh Thiện',
        username: 'anhthien',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '9bc22f67-e3f9-48ef-91e9-c7e7eb07a39a',
    id: '47d5dd00-a062-11ec-8080-8000151e4a7f',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-10T11:07:49.043764Z',
          updated_at: '2022-03-10T11:07:49.043764Z',
          id: 'a062e20d-c7d0-459e-b2e8-9424e0e1b2f6',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment',
          activity_id: '47d5dd00-a062-11ec-8080-8000151e4a7f',
          data: {
            content: 'helu',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-10T11:07:49.073594Z',
          updated_at: '2022-03-10T11:07:49.073594Z',
          id: '7fea6f10-bb01-4368-8c7e-ccefbf0f3863',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: '47d5dd00-a062-11ec-8080-8000151e4a7f',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      rolling_on_the_floor_laughing: [
        {
          id: '1d5c3bf3-cb84-42ce-aa17-b055b891e683',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'rolling_on_the_floor_laughing',
          parent: '',
          activity_id: '47d5dd00-a062-11ec-8080-8000151e4a7f',
          created_at: '2022-03-14T10:57:39.282479Z',
          updated_at: '2022-03-14T10:57:39.282479Z',
        },
        {
          id: '809b4938-c41d-4277-923b-9fda6e94329c',
          user_id: '16',
          user: {
            id: '16',
            data: {
              fullname: 'Nguyễn Anh Thiện',
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              username: 'anhthien',
            },
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
          },
          kind: 'rolling_on_the_floor_laughing',
          parent: '',
          activity_id: '47d5dd00-a062-11ec-8080-8000151e4a7f',
          created_at: '2022-03-10T12:28:59.948767Z',
          updated_at: '2022-03-10T12:28:59.948767Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '',
      },
    },
    mentions: {
      users: {
        undefined: {
          id: '33',
          data: {
            fullname: 'Nguyễn Thị Ngọc Linh',
            avatar:
              'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
          },
          created_at: '2022-01-11T02:46:10.540203Z',
          updated_at: '2022-03-14T10:59:10.736036Z',
        },
      },
      groups: {},
    },
    object: {
      id: 'e3d4cbc8-4b1c-4ca0-b6d2-2878bfe22ee1',
      collection: 'post',
      foreign_id: 'post:e3d4cbc8-4b1c-4ca0-b6d2-2878bfe22ee1',
      data: {
        images: [],
        videos: [],
        files: [],
        content: '@ngoclinh  test test',
      },
      created_at: '2022-03-10T11:07:22.425657Z',
      updated_at: '2022-03-10T11:07:30.982317Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 1,
      comment_count: 1,
      rolling_on_the_floor_laughing: 2,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-10T11:07:31.408000',
    type: 'post',
    verb: 'post',
    reactions_order: ['rolling_on_the_floor_laughing'],
  },
  {
    actor: {
      created_at: '2022-01-11T02:46:10.540203Z',
      updated_at: '2022-03-14T10:59:10.736036Z',
      id: '33',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        fullname: 'Nguyễn Thị Ngọc Linh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '5d20f6d1-8100-4c0c-8170-222ddd939aa1',
    id: 'bbec1a80-a060-11ec-8080-8001261dfcf3',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      stuck_out_tongue_closed_eyes: [
        {
          id: 'e5ab0bb2-0371-42d6-9fbb-3d2dba9f0921',
          user_id: '16',
          user: {
            id: '16',
            data: {
              fullname: 'Nguyễn Anh Thiện',
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              username: 'anhthien',
            },
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
          },
          kind: 'stuck_out_tongue_closed_eyes',
          parent: '',
          activity_id: 'bbec1a80-a060-11ec-8080-8001261dfcf3',
          created_at: '2022-03-10T12:29:12.660716Z',
          updated_at: '2022-03-10T12:29:12.660716Z',
        },
      ],
      comment: [],
    },
    latest_reactions_extra: {},
    mentions: {
      users: {
        trankimmai: {
          id: '40',
          data: {
            username: 'trankimmai',
            fullname: 'Trần Thị Kim Mai',
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          },
          created_at: '2022-01-11T02:46:13.178254Z',
          updated_at: '2022-01-11T02:46:13.178254Z',
        },
      },
      groups: {},
    },
    object: {
      id: '1691d04c-728f-4e55-9593-6fdb655d176e',
      collection: 'post',
      foreign_id: 'post:1691d04c-728f-4e55-9593-6fdb655d176e',
      data: {
        images: [],
        videos: [],
        files: [],
        content: '@trankimmai ',
      },
      created_at: '2022-03-10T10:56:19.07865Z',
      updated_at: '2022-03-10T10:56:26.786047Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      stuck_out_tongue_closed_eyes: 1,
      comment_count: 0,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-10T10:56:27.176000',
    type: 'post',
    verb: 'post',
    reactions_order: ['stuck_out_tongue_closed_eyes'],
  },
  {
    actor: {
      created_at: '2022-01-11T02:46:10.540203Z',
      updated_at: '2022-03-14T10:59:10.736036Z',
      id: '33',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        fullname: 'Nguyễn Thị Ngọc Linh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'db8813c9-6205-4b80-bc62-4a985009a1fe',
    id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-10T11:26:44.339464Z',
          updated_at: '2022-03-10T11:26:44.339464Z',
          id: '87cd29c8-b5cf-44d1-9086-013d95d773fd',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {
            content: 'hihi',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-10T11:27:05.072784Z',
                updated_at: '2022-03-10T11:27:05.072784Z',
                id: '0ee8a633-8b6f-4e96-ae6e-0b68af2f909b',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
                data: {
                  content: '@ngoclinh hi gi ma hi',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-33'],
                parent: '87cd29c8-b5cf-44d1-9086-013d95d773fd',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-10T11:14:51.074845Z',
          updated_at: '2022-03-10T11:14:51.074845Z',
          id: '80c7597e-42e7-40f7-bd79-5a44aa1c83d6',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {
            content: 'alo',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-10T11:25:27.123207Z',
                updated_at: '2022-03-10T11:25:27.123207Z',
                id: '78ca20cc-48b1-43dc-aba2-3f2bcfdeeea0',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
                data: {
                  content: 'chán quá',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-33'],
                parent: '80c7597e-42e7-40f7-bd79-5a44aa1c83d6',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:15:12.062830Z',
                updated_at: '2022-03-10T11:15:12.062830Z',
                id: '37d7bdb3-1ec8-4b6f-a59d-e7e5799b19d6',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
                data: {
                  content: '@ngoclinh sao',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-33'],
                parent: '80c7597e-42e7-40f7-bd79-5a44aa1c83d6',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 2,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-10T11:09:02.657046Z',
          updated_at: '2022-03-10T11:09:02.657046Z',
          id: '354299ca-fc3b-4a20-bb51-8ae3a2e2d890',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {
            content: 'f32f2',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-33'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-10T11:09:00.687966Z',
          updated_at: '2022-03-10T11:09:00.687966Z',
          id: '3f55aafc-0308-4e38-9c1b-614742c522e7',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {
            content: 'dqwdwq',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-33'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-10T11:08:59.867482Z',
          updated_at: '2022-03-10T11:08:59.867482Z',
          id: '55caede8-9b06-4faf-9558-01d913728573',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {
            content: 'dqwdqw',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-33'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-10T11:27:05.164395Z',
          updated_at: '2022-03-10T11:27:05.164395Z',
          id: '8d2bad2e-aac8-4ded-a851-d22753995d98',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:26:44.377423Z',
          updated_at: '2022-03-10T11:26:44.377423Z',
          id: '86627f7b-83f9-414b-8790-6bcabf76a41a',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:25:27.170363Z',
          updated_at: '2022-03-10T11:25:27.170363Z',
          id: 'f543f28b-ae57-4f5c-b068-3b70f28f7421',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:15:12.186182Z',
          updated_at: '2022-03-10T11:15:12.186182Z',
          id: '96d9a9bb-6239-4573-8c95-f0c3fd5f1b89',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:14:51.109245Z',
          updated_at: '2022-03-10T11:14:51.109245Z',
          id: 'b8ec8bbe-6472-4b65-88c9-6ac858377eb3',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      grin: [
        {
          id: '836392db-afc5-4086-a263-fa02978312b7',
          user_id: '16',
          user: {
            id: '16',
            data: {
              fullname: 'Nguyễn Anh Thiện',
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              username: 'anhthien',
            },
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
          },
          kind: 'grin',
          parent: '',
          activity_id: 'b78e0d00-a05f-11ec-8080-800016f1fec8',
          created_at: '2022-03-10T11:03:29.585786Z',
          updated_at: '2022-03-10T11:03:29.585786Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: 'f41f1c26-e824-4715-947e-a07ad75f00fe',
      collection: 'post',
      foreign_id: 'post:f41f1c26-e824-4715-947e-a07ad75f00fe',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'test test',
      },
      created_at: '2022-03-10T10:48:59.86389Z',
      updated_at: '2022-03-10T10:49:09.929428Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 7,
      comment_count: 12,
      grin: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-10T10:49:10.352000',
    type: 'post',
    verb: 'post',
    reactions_order: ['grin'],
  },
  {
    actor: {
      created_at: '2022-01-11T02:46:10.540203Z',
      updated_at: '2022-03-14T10:59:10.736036Z',
      id: '33',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        fullname: 'Nguyễn Thị Ngọc Linh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '8d06435c-c622-49c9-8f34-c4ea3e276aa4',
    id: '3a0bf830-9ecd-11ec-8080-80007682501c',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-10T03:46:11.668566Z',
          updated_at: '2022-03-10T03:46:11.668566Z',
          id: '47ba98ca-b4f0-4976-b930-bd6f318bb80d',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          data: {
            content: 'mmm',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-33'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-09T04:06:38.303405Z',
          updated_at: '2022-03-09T04:06:38.303405Z',
          id: '402ac505-0574-409e-8a8f-27ee66759c4a',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          data: {
            content: 'ok',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            satisfied: [
              {
                id: 'ee5151c5-3a40-4123-bda5-8b4cfde8e05b',
                user_id: '33',
                user: {
                  id: '33',
                  data: {
                    fullname: 'Nguyễn Thị Ngọc Linh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                  },
                  created_at: '2022-01-11T02:46:10.540203Z',
                  updated_at: '2022-03-14T10:59:10.736036Z',
                },
                kind: 'satisfied',
                parent: '402ac505-0574-409e-8a8f-27ee66759c4a',
                activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
                created_at: '2022-03-14T10:58:54.560027Z',
                updated_at: '2022-03-14T10:58:54.560027Z',
              },
            ],
          },
          children_counts: {
            satisfied: 1,
            comment_count: 0,
          },
          own_children: {
            satisfied: [],
          },
        },
        {
          created_at: '2022-03-08T10:52:47.941277Z',
          updated_at: '2022-03-08T10:52:47.941277Z',
          id: '9b598703-8405-4561-8142-14cb79276c6c',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          data: {
            content: 'xạooooo',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-33'],
          parent: '',
          latest_children: {
            rolling_on_the_floor_laughing: [
              {
                id: '5d215161-60b0-4e08-9dab-ec283728a897',
                user_id: '33',
                user: {
                  id: '33',
                  data: {
                    fullname: 'Nguyễn Thị Ngọc Linh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                  },
                  created_at: '2022-01-11T02:46:10.540203Z',
                  updated_at: '2022-03-14T10:59:10.736036Z',
                },
                kind: 'rolling_on_the_floor_laughing',
                parent: '9b598703-8405-4561-8142-14cb79276c6c',
                activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
                created_at: '2022-03-14T10:58:42.587412Z',
                updated_at: '2022-03-14T10:58:42.587412Z',
              },
            ],
          },
          children_counts: {
            rolling_on_the_floor_laughing: 1,
            comment_count: 0,
          },
          own_children: {
            rolling_on_the_floor_laughing: [],
          },
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-10T03:46:11.725198Z',
          updated_at: '2022-03-10T03:46:11.725198Z',
          id: '74638e2b-90c9-4dab-bb1a-7ef5a8cf977b',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-09T04:06:38.357320Z',
          updated_at: '2022-03-09T04:06:38.357320Z',
          id: '5e8c4f04-7fb7-4e0a-901a-f555e0eec5f7',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-08T10:52:47.982008Z',
          updated_at: '2022-03-08T10:52:47.982008Z',
          id: 'b7344f48-63dc-4ef8-b5b1-cd1fb036a03c',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      wink: [
        {
          id: '66c721dc-827a-43a8-8784-da9fb0d6791e',
          user_id: '16',
          user: {
            id: '16',
            data: {
              fullname: 'Nguyễn Anh Thiện',
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              username: 'anhthien',
            },
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
          },
          kind: 'wink',
          parent: '',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          created_at: '2022-03-10T12:29:19.116051Z',
          updated_at: '2022-03-10T12:29:19.116051Z',
        },
      ],
      woozy_face: [
        {
          id: '87efa517-cecd-452a-b03d-1f87d1d68472',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'woozy_face',
          parent: '',
          activity_id: '3a0bf830-9ecd-11ec-8080-80007682501c',
          created_at: '2022-03-11T12:58:48.845426Z',
          updated_at: '2022-03-11T12:58:48.845426Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '83f5608a-a76d-41e0-8b85-41786704e792',
      collection: 'post',
      foreign_id: 'post:83f5608a-a76d-41e0-8b85-41786704e792',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Tôi xin thông báo lỗi cors kp từ phía feed nhé  :v ',
      },
      created_at: '2022-03-08T10:47:41.732584Z',
      updated_at: '2022-03-08T10:48:01.671928Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 3,
      comment_count: 3,
      wink: 1,
      woozy_face: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-08T10:48:02.099000',
    type: 'post',
    verb: 'post',
    reactions_order: ['wink', 'woozy_face'],
  },
  {
    actor: {
      created_at: '2022-01-10T10:03:38.942268Z',
      updated_at: '2022-01-12T10:03:28.410405Z',
      id: '10',
      data: {
        avatar:
          'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
        fullname: 'Diệp Lâm Minh Thư',
        username: 'dlminhthu',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '1ff113c7-fa67-4e64-bbe4-27253c41b1d1',
    id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-04T04:37:43.970527Z',
          updated_at: '2022-03-04T04:37:43.970527Z',
          id: '2e98bc45-0a72-4ab9-ad9e-dbe549772462',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {
            content: '...',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-10'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-04T04:37:43.968958Z',
          updated_at: '2022-03-04T04:37:43.968958Z',
          id: 'a2790994-aef1-4724-a93e-42ba2790dbe5',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {
            content: '...',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-10'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-04T04:35:02.784966Z',
          updated_at: '2022-03-04T04:35:02.784966Z',
          id: '89b78120-bc30-4705-b729-b86345659538',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {
            content: 'Okkk',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-10'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-04T04:35:02.718948Z',
          updated_at: '2022-03-04T04:35:02.718948Z',
          id: 'e2ec0f93-dd43-4ccf-bb54-af9044e4ae4b',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {
            content: 'Okkk',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-10'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-03T03:07:03.590455Z',
          updated_at: '2022-03-03T03:07:03.590455Z',
          id: 'a5371d31-dd5d-4395-b5f8-92b08d64fbc7',
          user_id: '10',
          user: {
            created_at: '2022-01-10T10:03:38.942268Z',
            updated_at: '2022-01-12T10:03:28.410405Z',
            id: '10',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Diệp Lâm Minh Thư',
              username: 'dlminhthu',
            },
          },
          kind: 'comment',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {
            content: 'alo',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            satisfied: [
              {
                id: 'e0afceb1-6b12-4f74-889e-2c2399d48ada',
                user_id: '12',
                user: {
                  id: '12',
                  data: {
                    fullname: 'Diem Trang',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                  },
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                },
                kind: 'satisfied',
                parent: 'a5371d31-dd5d-4395-b5f8-92b08d64fbc7',
                activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
                created_at: '2022-03-03T03:07:11.796663Z',
                updated_at: '2022-03-03T03:07:11.796663Z',
              },
            ],
          },
          children_counts: {
            satisfied: 1,
            comment_count: 0,
          },
          own_children: {
            satisfied: [],
          },
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-04T04:37:44.013468Z',
          updated_at: '2022-03-04T04:37:44.013468Z',
          id: '7aeafc66-8671-4191-9f1b-eb38db1f84fe',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-04T04:37:44.012745Z',
          updated_at: '2022-03-04T04:37:44.012745Z',
          id: '92f51d2f-bed4-4cca-951a-cc1ff0385773',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-04T04:35:02.835128Z',
          updated_at: '2022-03-04T04:35:02.835128Z',
          id: '2b682727-092f-485e-81b2-7a5c4d053424',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-04T04:35:02.774100Z',
          updated_at: '2022-03-04T04:35:02.774100Z',
          id: 'b69f6c02-9002-4aab-950f-429c4de82356',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-03T03:07:03.623949Z',
          updated_at: '2022-03-03T03:07:03.623949Z',
          id: 'c5c0f439-aefe-4bdb-ae13-00a555f7c172',
          user_id: '10',
          user: {
            created_at: '2022-01-10T10:03:38.942268Z',
            updated_at: '2022-01-12T10:03:28.410405Z',
            id: '10',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Diệp Lâm Minh Thư',
              username: 'dlminhthu',
            },
          },
          kind: 'comment_count',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      flag_ai: [
        {
          id: '1b7404b7-e7c7-464f-9f45-175634052197',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'flag-ai',
          parent: '',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          created_at: '2022-03-03T04:00:45.709987Z',
          updated_at: '2022-03-03T04:00:45.709987Z',
        },
      ],
      grin: [
        {
          id: '00ea8664-b840-4d21-92f1-4a0210b03c56',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'grin',
          parent: '',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          created_at: '2022-03-03T03:21:56.534387Z',
          updated_at: '2022-03-03T03:21:56.534387Z',
        },
      ],
      satisfied: [
        {
          id: '2a7aa31f-2416-4778-a6a4-9cbbc0eae712',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'satisfied',
          parent: '',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          created_at: '2022-03-03T03:22:09.636584Z',
          updated_at: '2022-03-03T03:22:09.636584Z',
        },
      ],
      smile: [
        {
          id: '7aa5cdc9-872e-4d0a-8b72-41f5f2a20224',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'smile',
          parent: '',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          created_at: '2022-03-03T03:26:32.550240Z',
          updated_at: '2022-03-03T03:26:32.550240Z',
        },
        {
          id: 'deb217f4-4a41-4bac-95f0-7145a350df85',
          user_id: '12',
          user: {
            id: '12',
            data: {
              fullname: 'Diem Trang',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
            },
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
          },
          kind: 'smile',
          parent: '',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          created_at: '2022-03-03T03:05:23.421552Z',
          updated_at: '2022-03-03T03:05:23.421552Z',
        },
      ],
      sparkler: [
        {
          id: '2b309c8b-e368-4c21-9406-86a967245650',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'sparkler',
          parent: '',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          created_at: '2022-03-09T04:22:57.397790Z',
          updated_at: '2022-03-09T04:22:57.397790Z',
        },
        {
          id: 'd277d664-3fa6-4c7f-9f7e-215165dea38a',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'sparkler',
          parent: '',
          activity_id: 'be1d8a40-9a9e-11ec-8080-800057cb7220',
          created_at: '2022-03-03T03:22:26.782801Z',
          updated_at: '2022-03-03T03:22:26.782801Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '3663c4d1-4711-48be-8f0c-3f8a98b48f22',
      collection: 'post',
      foreign_id: 'post:3663c4d1-4711-48be-8f0c-3f8a98b48f22',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'test notification',
      },
      created_at: '2022-03-03T03:04:52.27092Z',
      updated_at: '2022-03-03T03:05:12.274785Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 5,
      comment_count: 5,
      flag_ai: 1,
      grin: 1,
      satisfied: 1,
      smile: 2,
      sparkler: 2,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-03T03:05:12.676000',
    type: 'post',
    verb: 'post',
    reactions_order: ['smile', 'grin', 'satisfied', 'sparkler', 'flag-ai'],
  },
  {
    actor: {
      created_at: '2022-01-10T03:50:58.527007Z',
      updated_at: '2022-02-11T09:08:10.989228Z',
      id: '3',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
        fullname: 'Huỳnh Phương Khanh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '69917233-2cd8-4e13-9213-4c157cb6af93',
    id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-02T10:16:18.612520Z',
          updated_at: '2022-03-02T10:16:18.612520Z',
          id: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '13',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-10T11:41:04.943958Z',
                updated_at: '2022-03-10T11:41:04.943958Z',
                id: 'ff109928-e9de-48d0-a739-56df74424d19',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '@ngoclinh khong them tiep ha',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:40:23.675338Z',
                updated_at: '2022-03-10T11:40:23.675338Z',
                id: '3140de23-f63e-4e5f-be47-b1e4bcf41009',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '@ngoclinh test tiep ne',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:34:36.152855Z',
                updated_at: '2022-03-10T11:34:36.152855Z',
                id: '70fc0d98-1289-4299-82d7-02fb5dad3ed5',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: 'gi nua',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:32:19.779311Z',
                updated_at: '2022-03-10T11:32:19.779311Z',
                id: 'c731f15e-3052-4e10-8e3a-f01018799f12',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: 'ha',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:32:00.424924Z',
                updated_at: '2022-03-10T11:32:00.424924Z',
                id: '696f138d-35be-435b-ab7b-0d32b9265b95',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '@ngoclinh ha',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:31:45.054773Z',
                updated_at: '2022-03-10T11:31:45.054773Z',
                id: '872c6203-23e9-4bfa-942b-5f2fe12652da',
                user_id: '33',
                user: {
                  created_at: '2022-01-11T02:46:10.540203Z',
                  updated_at: '2022-03-14T10:59:10.736036Z',
                  id: '33',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                    fullname: 'Nguyễn Thị Ngọc Linh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: 'gi',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {
                  rolling_on_the_floor_laughing: [
                    {
                      id: '0fa5905b-3aaf-41af-91c8-099739b884a0',
                      user_id: '16',
                      user: {
                        id: '16',
                        data: {
                          fullname: 'Nguyễn Anh Thiện',
                          avatar:
                            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                          username: 'anhthien',
                        },
                        created_at: '2022-01-10T10:03:41.586970Z',
                        updated_at: '2022-01-12T10:03:37.435053Z',
                      },
                      kind: 'rolling_on_the_floor_laughing',
                      parent: '872c6203-23e9-4bfa-942b-5f2fe12652da',
                      activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                      created_at: '2022-03-10T12:28:37.237570Z',
                      updated_at: '2022-03-10T12:28:37.237570Z',
                    },
                  ],
                },
                children_counts: {
                  rolling_on_the_floor_laughing: 1,
                  comment_count: 0,
                },
                own_children: {
                  rolling_on_the_floor_laughing: [],
                },
              },
              {
                created_at: '2022-03-02T10:25:04.319968Z',
                updated_at: '2022-03-02T10:25:04.319968Z',
                id: '1fd17251-a87f-4dde-9270-4b803c75c65d',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '444',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:24:50.509072Z',
                updated_at: '2022-03-02T10:24:50.509072Z',
                id: 'c8678547-fd2d-40af-8ad0-7f0b113dc544',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '333',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:24:46.687096Z',
                updated_at: '2022-03-02T10:24:46.687096Z',
                id: 'be77f1c1-83de-4cfd-b302-4337f5bbeab5',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '222',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:24:43.641350Z',
                updated_at: '2022-03-02T10:24:43.641350Z',
                id: '2afb996f-c81f-4b83-97bc-0bcb7ae6f5c5',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 10,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-03-02T10:16:15.927420Z',
          updated_at: '2022-03-02T10:16:15.927420Z',
          id: 'c29c1574-4300-434f-bfb8-426e926534d3',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '12',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-02T10:15:12.460282Z',
          updated_at: '2022-03-02T10:16:12.399799Z',
          id: '5d06b3f4-9a48-4c9c-a109-6f32c45ff4a4',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '11',
            edited: true,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-02T10:03:52.490627Z',
          updated_at: '2022-03-02T10:03:52.490627Z',
          id: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '10',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-02T10:14:24.022305Z',
                updated_at: '2022-03-02T10:14:24.022305Z',
                id: '65d89aa9-b7cf-4fac-8a34-78f6dc6b7a4f',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '444',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:14:20.439735Z',
                updated_at: '2022-03-02T10:14:20.439735Z',
                id: '8c546430-83c2-4085-830b-52658641ede0',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '333',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:14:17.723913Z',
                updated_at: '2022-03-02T10:14:17.723913Z',
                id: '480a28d8-e2ed-419b-b3f7-505ae35d05f8',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '222',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:14:14.667335Z',
                updated_at: '2022-03-02T10:14:14.667335Z',
                id: '863669c8-fdb2-48f6-86b5-8f76f2c94063',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 4,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-03-02T10:03:49.311584Z',
          updated_at: '2022-03-02T10:03:49.311584Z',
          id: 'fe3d8a11-0e4a-40ca-8df9-971fdc3f1e6c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '9',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-10T11:41:05.073323Z',
          updated_at: '2022-03-10T11:41:05.073323Z',
          id: '24368be4-cb43-40cc-b648-684554262563',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:40:23.780145Z',
          updated_at: '2022-03-10T11:40:23.780145Z',
          id: '080f3727-1467-424a-822f-d8bb42e62663',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:34:36.186888Z',
          updated_at: '2022-03-10T11:34:36.186888Z',
          id: '7a803ae5-8a81-4067-ad6d-e2885b951a14',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:32:19.814268Z',
          updated_at: '2022-03-10T11:32:19.814268Z',
          id: 'c1562fde-9102-47e2-bc0a-9c201521eee6',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-10T11:32:00.506958Z',
          updated_at: '2022-03-10T11:32:00.506958Z',
          id: 'dce3a158-84a4-47b7-a7db-afbbd8f1b2ac',
          user_id: '16',
          user: {
            created_at: '2022-01-10T10:03:41.586970Z',
            updated_at: '2022-01-12T10:03:37.435053Z',
            id: '16',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Anh Thiện',
              username: 'anhthien',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '60e51551-a319-45f5-b111-6795b9f0b3ef',
      collection: 'post',
      foreign_id: 'post:60e51551-a319-45f5-b111-6795b9f0b3ef',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Test comment 2',
      },
      created_at: '2022-03-02T10:03:11.565144Z',
      updated_at: '2022-03-02T10:03:17.718265Z',
    },
    origin: null,
    own_reactions: {
      comment: [
        {
          created_at: '2022-03-02T10:16:18.612520Z',
          updated_at: '2022-03-02T10:16:18.612520Z',
          id: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '13',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-10T11:41:04.943958Z',
                updated_at: '2022-03-10T11:41:04.943958Z',
                id: 'ff109928-e9de-48d0-a739-56df74424d19',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '@ngoclinh khong them tiep ha',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:40:23.675338Z',
                updated_at: '2022-03-10T11:40:23.675338Z',
                id: '3140de23-f63e-4e5f-be47-b1e4bcf41009',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '@ngoclinh test tiep ne',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:34:36.152855Z',
                updated_at: '2022-03-10T11:34:36.152855Z',
                id: '70fc0d98-1289-4299-82d7-02fb5dad3ed5',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: 'gi nua',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:32:19.779311Z',
                updated_at: '2022-03-10T11:32:19.779311Z',
                id: 'c731f15e-3052-4e10-8e3a-f01018799f12',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: 'ha',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:32:00.424924Z',
                updated_at: '2022-03-10T11:32:00.424924Z',
                id: '696f138d-35be-435b-ab7b-0d32b9265b95',
                user_id: '16',
                user: {
                  created_at: '2022-01-10T10:03:41.586970Z',
                  updated_at: '2022-01-12T10:03:37.435053Z',
                  id: '16',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                    fullname: 'Nguyễn Anh Thiện',
                    username: 'anhthien',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '@ngoclinh ha',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      ngoclinh: {
                        id: '33',
                        data: {
                          username: 'ngoclinh',
                          fullname: 'Nguyễn Thị Ngọc Linh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-10T11:31:45.054773Z',
                updated_at: '2022-03-10T11:31:45.054773Z',
                id: '872c6203-23e9-4bfa-942b-5f2fe12652da',
                user_id: '33',
                user: {
                  created_at: '2022-01-11T02:46:10.540203Z',
                  updated_at: '2022-03-14T10:59:10.736036Z',
                  id: '33',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                    fullname: 'Nguyễn Thị Ngọc Linh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: 'gi',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {
                  rolling_on_the_floor_laughing: [
                    {
                      id: '0fa5905b-3aaf-41af-91c8-099739b884a0',
                      user_id: '16',
                      user: {
                        id: '16',
                        data: {
                          fullname: 'Nguyễn Anh Thiện',
                          avatar:
                            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                          username: 'anhthien',
                        },
                        created_at: '2022-01-10T10:03:41.586970Z',
                        updated_at: '2022-01-12T10:03:37.435053Z',
                      },
                      kind: 'rolling_on_the_floor_laughing',
                      parent: '872c6203-23e9-4bfa-942b-5f2fe12652da',
                      activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                      created_at: '2022-03-10T12:28:37.237570Z',
                      updated_at: '2022-03-10T12:28:37.237570Z',
                    },
                  ],
                },
                children_counts: {
                  rolling_on_the_floor_laughing: 1,
                  comment_count: 0,
                },
                own_children: {
                  rolling_on_the_floor_laughing: [],
                },
              },
              {
                created_at: '2022-03-02T10:25:04.319968Z',
                updated_at: '2022-03-02T10:25:04.319968Z',
                id: '1fd17251-a87f-4dde-9270-4b803c75c65d',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '444',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:24:50.509072Z',
                updated_at: '2022-03-02T10:24:50.509072Z',
                id: 'c8678547-fd2d-40af-8ad0-7f0b113dc544',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '333',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:24:46.687096Z',
                updated_at: '2022-03-02T10:24:46.687096Z',
                id: 'be77f1c1-83de-4cfd-b302-4337f5bbeab5',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '222',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:24:43.641350Z',
                updated_at: '2022-03-02T10:24:43.641350Z',
                id: '2afb996f-c81f-4b83-97bc-0bcb7ae6f5c5',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2d288e12-e81d-4a29-a0c6-fdb98db59247',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 10,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-03-02T10:16:15.927420Z',
          updated_at: '2022-03-02T10:16:15.927420Z',
          id: 'c29c1574-4300-434f-bfb8-426e926534d3',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '12',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-02T10:15:12.460282Z',
          updated_at: '2022-03-02T10:16:12.399799Z',
          id: '5d06b3f4-9a48-4c9c-a109-6f32c45ff4a4',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '11',
            edited: true,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-02T10:03:52.490627Z',
          updated_at: '2022-03-02T10:03:52.490627Z',
          id: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '10',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-02T10:14:24.022305Z',
                updated_at: '2022-03-02T10:14:24.022305Z',
                id: '65d89aa9-b7cf-4fac-8a34-78f6dc6b7a4f',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '444',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:14:20.439735Z',
                updated_at: '2022-03-02T10:14:20.439735Z',
                id: '8c546430-83c2-4085-830b-52658641ede0',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '333',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:14:17.723913Z',
                updated_at: '2022-03-02T10:14:17.723913Z',
                id: '480a28d8-e2ed-419b-b3f7-505ae35d05f8',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '222',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:14:14.667335Z',
                updated_at: '2022-03-02T10:14:14.667335Z',
                id: '863669c8-fdb2-48f6-86b5-8f76f2c94063',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '4684a5c5-d7f2-412c-87d0-6b4819549c9c',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 4,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-03-02T10:03:49.311584Z',
          updated_at: '2022-03-02T10:03:49.311584Z',
          id: 'fe3d8a11-0e4a-40ca-8df9-971fdc3f1e6c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {
            content: '9',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-02T10:25:04.414168Z',
          updated_at: '2022-03-02T10:25:04.414168Z',
          id: 'b43e5136-785d-48d9-9614-18ba01bb3b58',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:24:54.331310Z',
          updated_at: '2022-03-02T10:24:54.331310Z',
          id: '0edc81c3-7cc2-4441-8c11-3ffe1ce9966a',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:24:50.553220Z',
          updated_at: '2022-03-02T10:24:50.553220Z',
          id: '3b02bc4c-34b7-4d38-b2c7-05d0517ac2a5',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:24:46.716213Z',
          updated_at: '2022-03-02T10:24:46.716213Z',
          id: 'b4c2649c-ae06-4368-be0b-7565edab426a',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:24:43.677221Z',
          updated_at: '2022-03-02T10:24:43.677221Z',
          id: '8e70c256-5e87-4c0d-88cb-67555fd5a333',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'fbca2a40-9a0f-11ec-8080-80004d77ce46',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    reaction_counts: {
      comment: 13,
      comment_count: 32,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-02T10:03:18.116000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:50:58.527007Z',
      updated_at: '2022-02-11T09:08:10.989228Z',
      id: '3',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
        fullname: 'Huỳnh Phương Khanh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '91836c9f-4510-4e18-a42b-9f0ddaa225ab',
    id: 'a537d790-9a0f-11ec-8080-80007fa94afb',
    important: {
      active: false,
      expires_time: null,
    },
    is_draft: false,
    latest_reactions: {
      comment: [],
    },
    latest_reactions_extra: {},
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '8aeb57ba-1976-43b6-8752-02ea5742be41',
      collection: 'post',
      foreign_id: 'post:8aeb57ba-1976-43b6-8752-02ea5742be41',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Test comment 1',
      },
      created_at: '2022-03-02T10:00:39.173337Z',
      updated_at: '2022-03-02T10:01:21.301735Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment_count: 0,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-02T10:00:52.873000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
        {
          id: '26',
          collection: 'groups',
          foreign_id: 'groups:26',
          data: {
            icon: null,
            name: 'test group bug',
          },
          created_at: '2022-01-10T17:29:23.809405Z',
          updated_at: '2022-01-10T17:29:23.809405Z',
        },
        {
          id: '67',
          collection: 'groups',
          foreign_id: 'groups:67',
          data: {
            icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
            name: 'Group test chi co minh toi',
          },
          created_at: '2022-01-25T12:36:41.406295Z',
          updated_at: '2022-01-25T12:36:41.406295Z',
        },
      ],
      users: [],
    },
    foreign_id: 'f16d5409-9e59-403c-8e3e-5e2e43d43131',
    id: 'dc191ff0-9945-11ec-8080-800165d21c24',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-02T07:39:20.894211Z',
          updated_at: '2022-03-02T07:39:20.894211Z',
          id: '2189376d-abc7-4afa-8089-025f683f9b99',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-02T10:19:47.549942Z',
                updated_at: '2022-03-02T10:19:47.549942Z',
                id: '4c82fb18-6eee-4824-b751-2d12cf8dfe5d',
                user_id: '58',
                user: {
                  created_at: '2022-01-24T08:35:18.713097Z',
                  updated_at: '2022-03-14T08:19:30.365426Z',
                  id: '58',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
                    fullname: 'Nguyen Thi Thu Quyền',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '777',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2189376d-abc7-4afa-8089-025f683f9b99',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:19:36.905350Z',
                updated_at: '2022-03-02T10:19:36.905350Z',
                id: '68cab94d-7e3a-4ca1-ba25-92323b7d4c32',
                user_id: '58',
                user: {
                  created_at: '2022-01-24T08:35:18.713097Z',
                  updated_at: '2022-03-14T08:19:30.365426Z',
                  id: '58',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
                    fullname: 'Nguyen Thi Thu Quyền',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '666',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '2189376d-abc7-4afa-8089-025f683f9b99',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:12:47.883011Z',
                updated_at: '2022-03-02T10:12:47.883011Z',
                id: '11166773-62f6-486a-bb65-f3e2ac1de2d1',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '555',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-58'],
                parent: '2189376d-abc7-4afa-8089-025f683f9b99',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:12:44.568948Z',
                updated_at: '2022-03-02T10:12:44.568948Z',
                id: 'abf290e5-ee6e-4e06-a66d-828e9669f294',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '444',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-58'],
                parent: '2189376d-abc7-4afa-8089-025f683f9b99',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:12:41.527125Z',
                updated_at: '2022-03-02T10:12:41.527125Z',
                id: '0cf03d6e-36b5-44d9-8ffe-cbaa82c7e3ae',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '333',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-58'],
                parent: '2189376d-abc7-4afa-8089-025f683f9b99',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:12:38.286859Z',
                updated_at: '2022-03-02T10:12:38.286859Z',
                id: '51669754-0375-46ca-9f02-f8364d8115ff',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '222',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-58'],
                parent: '2189376d-abc7-4afa-8089-025f683f9b99',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-02T10:12:35.196825Z',
                updated_at: '2022-03-02T10:12:35.196825Z',
                id: '5ae642de-892b-4ef3-85b7-b2cb47c12a71',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-58'],
                parent: '2189376d-abc7-4afa-8089-025f683f9b99',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 7,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-03-02T07:31:44.432154Z',
          updated_at: '2022-03-02T07:31:44.432154Z',
          id: '7721b29e-dfc7-48cc-8109-af7fad8e90b3',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-02T10:20:07.054468Z',
                updated_at: '2022-03-02T10:20:07.054468Z',
                id: '23792478-9017-4d18-910f-1da203f3649c',
                user_id: '58',
                user: {
                  created_at: '2022-01-24T08:35:18.713097Z',
                  updated_at: '2022-03-14T08:19:30.365426Z',
                  id: '58',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
                    fullname: 'Nguyen Thi Thu Quyền',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '...',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '7721b29e-dfc7-48cc-8109-af7fad8e90b3',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-02T07:30:50.138341Z',
          updated_at: '2022-03-02T07:30:50.138341Z',
          id: '07f499ea-0a49-4fb2-af67-4ee5c2674da4',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-02T10:19:59.591496Z',
                updated_at: '2022-03-02T10:19:59.591496Z',
                id: '00fd192c-7e1b-4b84-9726-5f355b4a7913',
                user_id: '58',
                user: {
                  created_at: '2022-01-24T08:35:18.713097Z',
                  updated_at: '2022-03-14T08:19:30.365426Z',
                  id: '58',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
                    fullname: 'Nguyen Thi Thu Quyền',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '...',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '07f499ea-0a49-4fb2-af67-4ee5c2674da4',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-02T07:30:22.312216Z',
          updated_at: '2022-03-02T07:30:22.312216Z',
          id: '4144f807-cc68-48dd-9144-8bccc9e7064e',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-02T07:30:17.119679Z',
          updated_at: '2022-03-02T07:30:17.119679Z',
          id: '6d6cfcb9-2b1b-47b9-bc32-77be5eb1a117',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-02T10:54:19.791057Z',
                updated_at: '2022-03-02T10:54:19.791057Z',
                id: 'e267033f-671a-41b6-8a91-6c699369f73c',
                user_id: '58',
                user: {
                  created_at: '2022-01-24T08:35:18.713097Z',
                  updated_at: '2022-03-14T08:19:30.365426Z',
                  id: '58',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
                    fullname: 'Nguyen Thi Thu Quyền',
                  },
                },
                kind: 'comment',
                activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '6d6cfcb9-2b1b-47b9-bc32-77be5eb1a117',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-02T10:54:19.825466Z',
          updated_at: '2022-03-02T10:54:19.825466Z',
          id: '17724465-59b3-4165-896a-38143a767450',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:51:29.300627Z',
          updated_at: '2022-03-02T10:51:29.300627Z',
          id: 'a1aad591-2b33-4769-a010-c6903f5b46bd',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:20:07.106108Z',
          updated_at: '2022-03-02T10:20:07.106108Z',
          id: 'cb53acaf-e8bc-4443-9b3c-c9c6c163b426',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:19:59.619892Z',
          updated_at: '2022-03-02T10:19:59.619892Z',
          id: 'e96db0e6-bb37-4a70-ba39-2b999f23bfaa',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:19:47.579743Z',
          updated_at: '2022-03-02T10:19:47.579743Z',
          id: '09b82c1c-fa6b-4ab1-8910-4bf702a77eba',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      innocent: [
        {
          id: 'cb07bfb1-bab8-4dcb-8645-d278624be23c',
          user_id: '58',
          user: {
            id: '58',
            data: {
              fullname: 'Nguyen Thi Thu Quyền',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
            },
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
          },
          kind: 'innocent',
          parent: '',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          created_at: '2022-03-02T09:25:45.190515Z',
          updated_at: '2022-03-02T09:25:45.190515Z',
        },
      ],
      satisfied: [
        {
          id: '9df0fcce-de0d-4147-adbb-fee1c46703bd',
          user_id: '3',
          user: {
            id: '3',
            data: {
              fullname: 'Huỳnh Phương Khanh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
            },
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
          },
          kind: 'satisfied',
          parent: '',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          created_at: '2022-03-02T09:45:37.246365Z',
          updated_at: '2022-03-02T09:45:37.246365Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '664247a2-f313-4642-b538-7f272bdf13f4',
      collection: 'post',
      foreign_id: 'post:664247a2-f313-4642-b538-7f272bdf13f4',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'hello',
      },
      created_at: '2022-03-01T09:56:22.108145Z',
      updated_at: '2022-03-01T09:56:26.129381Z',
    },
    origin: null,
    own_reactions: {
      comment: [
        {
          created_at: '2022-03-02T03:50:06.917419Z',
          updated_at: '2022-03-02T03:50:06.917419Z',
          id: 'e627d32c-230d-43b1-89a5-1b71bedd9aad',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {
            content: 'Yooo',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-02T10:12:47.931520Z',
          updated_at: '2022-03-02T10:12:47.931520Z',
          id: '6d50ebb1-0371-4a27-9630-d2aade67d589',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:12:44.608471Z',
          updated_at: '2022-03-02T10:12:44.608471Z',
          id: 'c3dbdc4c-917c-4d5b-b077-f71cc23c9b7c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:12:41.631053Z',
          updated_at: '2022-03-02T10:12:41.631053Z',
          id: 'f86544fa-bdd0-4815-814e-5a924953cb42',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:12:38.327880Z',
          updated_at: '2022-03-02T10:12:38.327880Z',
          id: '37b147fb-d130-4fac-8e47-6947fb68e0e6',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-02T10:12:35.232186Z',
          updated_at: '2022-03-02T10:12:35.232186Z',
          id: '3ceb5218-555f-4628-b7b8-4f4f837a1445',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      satisfied: [
        {
          id: '9df0fcce-de0d-4147-adbb-fee1c46703bd',
          user_id: '3',
          user: {
            id: '3',
            data: {
              fullname: 'Huỳnh Phương Khanh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
            },
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
          },
          kind: 'satisfied',
          parent: '',
          activity_id: 'dc191ff0-9945-11ec-8080-800165d21c24',
          created_at: '2022-03-02T09:45:37.246365Z',
          updated_at: '2022-03-02T09:45:37.246365Z',
        },
      ],
    },
    reaction_counts: {
      comment: 19,
      comment_count: 39,
      innocent: 1,
      satisfied: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-01T09:56:26.607000',
    type: 'post',
    verb: 'post',
    reactions_order: ['innocent', 'satisfied'],
  },
  {
    actor: {
      created_at: '2022-01-10T03:50:58.527007Z',
      updated_at: '2022-02-11T09:08:10.989228Z',
      id: '3',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
        fullname: 'Huỳnh Phương Khanh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'a6974aaf-5d80-413c-bb5b-6b5f394e7f73',
    id: '329d9c80-9931-11ec-8080-80012d314a0c',
    important: {
      active: false,
      expires_time: null,
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-02T05:08:58.981878Z',
          updated_at: '2022-03-02T05:08:58.981878Z',
          id: '6a74a3dd-2e99-4421-9076-fdf7f9ab2bc0',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-3'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-01T08:10:40.656638Z',
          updated_at: '2022-03-01T08:10:40.656638Z',
          id: '04fe03d6-fdba-4374-b6b2-60a2cf32bca9',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '11',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-01T08:10:51.819025Z',
                updated_at: '2022-03-01T08:10:51.819025Z',
                id: '160a2b69-dccf-4d8b-acd9-2cbb6a53d53a',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '04fe03d6-fdba-4374-b6b2-60a2cf32bca9',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-03-01T07:29:17.013230Z',
          updated_at: '2022-03-01T07:29:17.013230Z',
          id: '97a7e0e5-698e-435b-9d1e-89915a63b485',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '10',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-01T07:29:15.449066Z',
          updated_at: '2022-03-01T07:29:15.449066Z',
          id: 'ea179110-36af-468b-a988-d81872ed624e',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '9',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-01T07:29:14.386283Z',
          updated_at: '2022-03-01T07:29:14.386283Z',
          id: '5a87789d-6512-498c-96c7-1b7fc41d9b82',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '8',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-02T05:08:59.032984Z',
          updated_at: '2022-03-02T05:08:59.032984Z',
          id: 'eda52b53-daca-47c2-b39d-a6760c596a6b',
          user_id: '58',
          user: {
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
            id: '58',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
              fullname: 'Nguyen Thi Thu Quyền',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:20:30.499031Z',
          updated_at: '2022-03-01T08:20:30.499031Z',
          id: 'd7e35d8c-f79d-42fa-8d9e-1608199b82ff',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:10:51.856042Z',
          updated_at: '2022-03-01T08:10:51.856042Z',
          id: '02b8450d-9a24-457d-b3a5-c31952fc0a6b',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:10:40.684530Z',
          updated_at: '2022-03-01T08:10:40.684530Z',
          id: '557eedc8-453f-49b9-994b-91345bbec817',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:10:10.725603Z',
          updated_at: '2022-03-01T08:10:10.725603Z',
          id: 'd085f8dd-52f5-4a49-a3d2-1f03e3d396c8',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '51d59a13-dc38-4005-90cd-1e0b7b9f6f45',
      collection: 'post',
      foreign_id: 'post:51d59a13-dc38-4005-90cd-1e0b7b9f6f45',
      data: {
        images: [],
        videos: [],
        files: [],
        content:
          'Bài viết dài không có markdown\n\nTác động của khí hậu đang tăng tốc nhanh với nhiều ảnh hưởng sẽ nghiêm trọng hơn dự báo và thế giới chỉ còn cơ hội ít ỏi nhằm tránh ảnh hưởng tồi tệ nhất đối với môi trường sống, theo tờ The Guardian ngày 28.2 dẫn báo cáo của Ủy ban Liên chính phủ về Biến đổi khí hậu (IPCC) thuộc Liên Hiệp Quốc.\n\nỞ mức hiện tại, hoạt động của con người đang làm khí hậu nóng lên, gây tác động diện rộng và nguy hiểm, đe dọa hủy hoại thế giới tự nhiên và khiến nhiều khu vực không còn sinh sống được nữa.\n\n“Chứng cứ khoa học là không thể nghi ngờ: biến đổi khí hậu là mối đe dọa đối với sức khỏe con người và hành tinh. Bất cứ sự trì hoãn nào đối với hành động phối hợp toàn cầu sẽ khiến thế giới bỏ lỡ cánh cửa hẹp đang khép nhanh để đảm bảo tương lai có thể sinh tồn”, theo ông Hans-Otto Pörtner, đồng chủ tịch một nhóm công tác của IPCC.\n\nBáo cáo được xem là “cảnh báo ảm đạm nhất” khi cho rằng hạn hán, lũ lụt, nắng nóng và những hiện tượng thời tiết cực đoan khác đang tăng tốc và gây thiệt hại gia tăng.\n\nViệc chỉ hạn chế mức tăng nhiệt độ trung bình toàn cầu lên 1,50C so với thời tiền công nghiệp vẫn sẽ gây ra những tác động không thể đảo ngược. Trong số đó có việc các sông băng, chóp băng tan chảy, các vùng ngập nước bị khô cạn và băng vĩnh cữu tan khiến nhiệt độ toàn cầu tăng thêm.\n\n“Bản án” cho nhân loại\nTổng thư ký Liên Hiệp Quốc Antonio Guterres chia sẻ rằng ông đã xem nhiều báo cáo khoa học nhưng chưa gặp báo cáo nào như lần này. Báo cáo của IPCC mô tả toàn cảnh về những gì con người hứng chịu và “bản án” dành cho việc quản lý khí hậu thất bại, theo ông Guterres.\n\nTheo báo cáo, mọi nơi sẽ bị ảnh hưởng, không khu vực sinh sống được nào thoát khỏi tác động nghiêm trọng từ việc nhiệt độ tăng và nhiều hiện tượng thời tiết cực đoan.\n\nMỹ, Trung Quốc bất ngờ công bố thỏa thuận về biến đổi khí hậu\nKhoảng phân nửa dân cư thế giới, từ 3,3-3,6 tỉ người sống trong những khu vực dễ bị tác động bởi biến đổi khí hậu. Hàng triệu người đối diện thiếu hụt nước, lương thực do biến đối khí hậu, thậm chí ở mức hiện tại.\n\nBên cạnh đó, hàng loạt các loài sinh vật bị biến mất, từ cây cối đến san hô, và điều nay đang diễn tiến. Những khu vực ven biển trên toàn cầu và những đảo nhỏ, thấp sẽ bị ngập. Những hệ sinh thái then chốt đang mất khả năng hấp thụ CO2 và biến thành những nơi sẽ phóng thích CO2.\n\nMột số nước đồng ý bảo tồn 30% diện tích đất trên trái đất, nhưng có thể cần bảo tồn phân nửa để khôi phục năng lực của hệ sinh thái đủ khả năng ứng phó thiệt hại.\n\nTác động của khí hậu đang tăng tốc nhanh với nhiều ảnh hưởng sẽ nghiêm trọng hơn dự báo và thế giới chỉ còn cơ hội ít ỏi nhằm tránh ảnh hưởng tồi tệ nhất đối với môi trường sống, theo tờ The Guardian ngày 28.2 dẫn báo cáo của Ủy ban Liên chính phủ về Biến đổi khí hậu (IPCC) thuộc Liên Hiệp Quốc.\n\nỞ mức hiện tại, hoạt động của con người đang làm khí hậu nóng lên, gây tác động diện rộng và nguy hiểm, đe dọa hủy hoại thế giới tự nhiên và khiến nhiều khu vực không còn sinh sống được nữa.\n\n“Chứng cứ khoa học là không thể nghi ngờ: biến đổi khí hậu là mối đe dọa đối với sức khỏe con người và hành tinh. Bất cứ sự trì hoãn nào đối với hành động phối hợp toàn cầu sẽ khiến thế giới bỏ lỡ cánh cửa hẹp đang khép nhanh để đảm bảo tương lai có thể sinh tồn”, theo ông Hans-Otto Pörtner, đồng chủ tịch một nhóm công tác của IPCC.\n\nBáo cáo được xem là “cảnh báo ảm đạm nhất” khi cho rằng hạn hán, lũ lụt, nắng nóng và những hiện tượng thời tiết cực đoan khác đang tăng tốc và gây thiệt hại gia tăng.\n\nViệc chỉ hạn chế mức tăng nhiệt độ trung bình toàn cầu lên 1,50C so với thời tiền công nghiệp vẫn sẽ gây ra những tác động không thể đảo ngược. Trong số đó có việc các sông băng, chóp băng tan chảy, các vùng ngập nước bị khô cạn và băng vĩnh cữu tan khiến nhiệt độ toàn cầu tăng thêm.\n\n“Bản án” cho nhân loại\nTổng thư ký Liên Hiệp Quốc Antonio Guterres chia sẻ rằng ông đã xem nhiều báo cáo khoa học nhưng chưa gặp báo cáo nào như lần này. Báo cáo của IPCC mô tả toàn cảnh về những gì con người hứng chịu và “bản án” dành cho việc quản lý khí hậu thất bại, theo ông Guterres.\n\nTheo báo cáo, mọi nơi sẽ bị ảnh hưởng, không khu vực sinh sống được nào thoát khỏi tác động nghiêm trọng từ việc nhiệt độ tăng và nhiều hiện tượng thời tiết cực đoan.\n\nMỹ, Trung Quốc bất ngờ công bố thỏa thuận về biến đổi khí hậu\nKhoảng phân nửa dân cư thế giới, từ 3,3-3,6 tỉ người sống trong những khu vực dễ bị tác động bởi biến đổi khí hậu. Hàng triệu người đối diện thiếu hụt nước, lương thực do biến đối khí hậu, thậm chí ở mức hiện tại.\n\nBên cạnh đó, hàng loạt các loài sinh vật bị biến mất, từ cây cối đến san hô, và điều nay đang diễn tiến. Những khu vực ven biển trên toàn cầu và những đảo nhỏ, thấp sẽ bị ngập. Những hệ sinh thái then chốt đang mất khả năng hấp thụ CO2 và biến thành những nơi sẽ phóng thích CO2.\n\nMột số nước đồng ý bảo tồn 30% diện tích đất trên trái đất, nhưng có thể cần bảo tồn phân nửa để khôi phục năng lực của hệ sinh thái đủ khả năng ứng phó thiệt hại.\n\nTác động của khí hậu đang tăng tốc nhanh với nhiều ảnh hưởng sẽ nghiêm trọng hơn dự báo và thế giới chỉ còn cơ hội ít ỏi nhằm tránh ảnh hưởng tồi tệ nhất đối với môi trường sống, theo tờ The Guardian ngày 28.2 dẫn báo cáo của Ủy ban Liên chính phủ về Biến đổi khí hậu (IPCC) thuộc Liên Hiệp Quốc.\n\nỞ mức hiện tại, hoạt động của con người đang làm khí hậu nóng lên, gây tác động diện rộng và nguy hiểm, đe dọa hủy hoại thế giới tự nhiên và khiến nhiều khu vực không còn sinh sống được nữa.\n\n“Chứng cứ khoa học là không thể nghi ngờ: biến đổi khí hậu là mối đe dọa đối với sức khỏe con người và hành tinh. Bất cứ sự trì hoãn nào đối với hành động phối hợp toàn cầu sẽ khiến thế giới bỏ lỡ cánh cửa hẹp đang khép nhanh để đảm bảo tương lai có thể sinh tồn”, theo ông Hans-Otto Pörtner, đồng chủ tịch một nhóm công tác của IPCC.\n\nBáo cáo được xem là “cảnh báo ảm đạm nhất” khi cho rằng hạn hán, lũ lụt, nắng nóng và những hiện tượng thời tiết cực đoan khác đang tăng tốc và gây thiệt hại gia tăng.\n\nViệc chỉ hạn chế mức tăng nhiệt độ trung bình toàn cầu lên 1,50C so với thời tiền công nghiệp vẫn sẽ gây ra những tác động không thể đảo ngược. Trong số đó có việc các sông băng, chóp băng tan chảy, các vùng ngập nước bị khô cạn và băng vĩnh cữu tan khiến nhiệt độ toàn cầu tăng thêm.\n\n“Bản án” cho nhân loại\nTổng thư ký Liên Hiệp Quốc Antonio Guterres chia sẻ rằng ông đã xem nhiều báo cáo khoa học nhưng chưa gặp báo cáo nào như lần này. Báo cáo của IPCC mô tả toàn cảnh về những gì con người hứng chịu và “bản án” dành cho việc quản lý khí hậu thất bại, theo ông Guterres.\n\nTheo báo cáo, mọi nơi sẽ bị ảnh hưởng, không khu vực sinh sống được nào thoát khỏi tác động nghiêm trọng từ việc nhiệt độ tăng và nhiều hiện tượng thời tiết cực đoan.\n\nMỹ, Trung Quốc bất ngờ công bố thỏa thuận về biến đổi khí hậu\nKhoảng phân nửa dân cư thế giới, từ 3,3-3,6 tỉ người sống trong những khu vực dễ bị tác động bởi biến đổi khí hậu. Hàng triệu người đối diện thiếu hụt nước, lương thực do biến đối khí hậu, thậm chí ở mức hiện tại.\n\nBên cạnh đó, hàng loạt các loài sinh vật bị biến mất, từ cây cối đến san hô, và điều nay đang diễn tiến. Những khu vực ven biển trên toàn cầu và những đảo nhỏ, thấp sẽ bị ngập. Những hệ sinh thái then chốt đang mất khả năng hấp thụ CO2 và biến thành những nơi sẽ phóng thích CO2.\n\nMột số nước đồng ý bảo tồn 30% diện tích đất trên trái đất, nhưng có thể cần bảo tồn phân nửa để khôi phục năng lực của hệ sinh thái đủ khả năng ứng phó thiệt hại.\n\nTác động của khí hậu đang tăng tốc nhanh với nhiều ảnh hưởng sẽ nghiêm trọng hơn dự báo và thế giới chỉ còn cơ hội ít ỏi nhằm tránh ảnh hưởng tồi tệ nhất đối với môi trường sống, theo tờ The Guardian ngày 28.2 dẫn báo cáo của Ủy ban Liên chính phủ về Biến đổi khí hậu (IPCC) thuộc Liên Hiệp Quốc.\n\nỞ mức hiện tại, hoạt động của con người đang làm khí hậu nóng lên, gây tác động diện rộng và nguy hiểm, đe dọa hủy hoại thế giới tự nhiên và khiến nhiều khu vực không còn sinh sống được nữa.\n\n“Chứng cứ khoa học là không thể nghi ngờ: biến đổi khí hậu là mối đe dọa đối với sức khỏe con người và hành tinh. Bất cứ sự trì hoãn nào đối với hành động phối hợp toàn cầu sẽ khiến thế giới bỏ lỡ cánh cửa hẹp đang khép nhanh để đảm bảo tương lai có thể sinh tồn”, theo ông Hans-Otto Pörtner, đồng chủ tịch một nhóm công tác của IPCC.\n\nBáo cáo được xem là “cảnh báo ảm đạm nhất” khi cho rằng hạn hán, lũ lụt, nắng nóng và những hiện tượng thời tiết cực đoan khác đang tăng tốc và gây thiệt hại gia tăng.\n\nViệc chỉ hạn chế mức tăng nhiệt độ trung bình toàn cầu lên 1,50C so với thời tiền công nghiệp vẫn sẽ gây ra những tác động không thể đảo ngược. Trong số đó có việc các sông băng, chóp băng tan chảy, các vùng ngập nước bị khô cạn và băng vĩnh cữu tan khiến nhiệt độ toàn cầu tăng thêm.\n\n“Bản án” cho nhân loại\nTổng thư ký Liên Hiệp Quốc Antonio Guterres chia sẻ rằng ông đã xem nhiều báo cáo khoa học nhưng chưa gặp báo cáo nào như lần này. Báo cáo của IPCC mô tả toàn cảnh về những gì con người hứng chịu và “bản án” dành cho việc quản lý khí hậu thất bại, theo ông Guterres.\n\nTheo báo cáo, mọi nơi sẽ bị ảnh hưởng, không khu vực sinh sống được nào thoát khỏi tác động nghiêm trọng từ việc nhiệt độ tăng và nhiều hiện tượng thời tiết cực đoan.\n\nMỹ, Trung Quốc bất ngờ công bố thỏa thuận về biến đổi khí hậu\nKhoảng phân nửa dân cư thế giới, từ 3,3-3,6 tỉ người sống trong những khu vực dễ bị tác động bởi biến đổi khí hậu. Hàng triệu người đối diện thiếu hụt nước, lương thực do biến đối khí hậu, thậm chí ở mức hiện tại.\n\nBên cạnh đó, hàng loạt các loài sinh vật bị biến mất, từ cây cối đến san hô, và điều nay đang diễn tiến. Những khu vực ven biển trên toàn cầu và những đảo nhỏ, thấp sẽ bị ngập. Những hệ sinh thái then chốt đang mất khả năng hấp thụ CO2 và biến thành những nơi sẽ phóng thích CO2.\n\nMột số nước đồng ý bảo tồn 30% diện tích đất trên trái đất, nhưng có thể cần bảo tồn phân nửa để khôi phục năng lực của hệ sinh thái đủ khả năng ứng phó thiệt hại.\nTác động của khí hậu đang tăng tốc nhanh với nhiều ảnh hưởng sẽ nghiêm trọng hơn dự báo và thế giới chỉ còn cơ hội ít ỏi nhằm tránh ảnh hưởng tồi tệ nhất đối với môi trường sống, theo tờ The Guardian ngày 28.2 dẫn báo cáo của Ủy ban Liên chính phủ về Biến đổi khí hậu (IPCC) thuộc Liên Hiệp Quốc.\n\nỞ mức hiện tại, hoạt động của con người đang làm khí hậu nóng lên, gây tác động diện rộng và nguy hiểm, đe dọa hủy hoại thế giới tự nhiên và khiến nhiều khu vực không còn sinh sống được nữa.\n\n“Chứng cứ khoa học là không thể nghi ngờ: biến đổi khí hậu là mối đe dọa đối với sức khỏe con người và hành tinh. Bất cứ sự trì hoãn nào đối với hành động phối hợp toàn cầu sẽ khiến thế giới bỏ lỡ cánh cửa hẹp đang khép nhanh để đảm bảo tương lai có thể sinh tồn”, theo ông Hans-Otto Pörtner, đồng chủ tịch một nhóm công tác của IPCC.\n\nBáo cáo được xem là “cảnh báo ảm đạm nhất” khi cho rằng hạn hán, lũ lụt, nắng nóng và những hiện tượng thời tiết cực đoan khác đang tăng tốc và gây thiệt hại gia tăng.\n\nViệc chỉ hạn chế mức tăng nhiệt độ trung bình toàn cầu lên 1,50C so với thời tiền công nghiệp vẫn sẽ gây ra những tác động không thể đảo ngược. Trong số đó có việc các sông băng, chóp băng tan chảy, các vùng ngập nước bị khô cạn và băng vĩnh cữu tan khiến nhiệt độ toàn cầu tăng thêm.\n\n“Bản án” cho nhân loại\nTổng thư ký Liên Hiệp Quốc Antonio Guterres chia sẻ rằng ông đã xem nhiều báo cáo khoa học nhưng chưa gặp báo cáo nào như lần này. Báo cáo của IPCC mô tả toàn cảnh về những gì con người hứng chịu và “bản án” dành cho việc quản lý khí hậu thất bại, theo ông Guterres.\n\nTheo báo cáo, mọi nơi sẽ bị ảnh hưởng, không khu vực sinh sống được nào thoát khỏi tác động nghiêm trọng từ việc nhiệt độ tăng và nhiều hiện tượng thời tiết cực đoan.\n\nMỹ, Trung Quốc bất ngờ công bố thỏa thuận về biến đổi khí hậu\nKhoảng phân nửa dân cư thế giới, từ 3,3-3,6 tỉ người sống trong những khu vực dễ bị tác động bởi biến đổi khí hậu. Hàng triệu người đối diện thiếu hụt nước, lương thực do biến đối khí hậu, thậm chí ở mức hiện tại.\n\nBên cạnh đó, hàng loạt các loài sinh vật bị biến mất, từ cây cối đến san hô, và điều nay đang diễn tiến. Những khu vực ven biển trên toàn cầu và những đảo nhỏ, thấp sẽ bị ngập. Những hệ sinh thái then chốt đang mất khả năng hấp thụ CO2 và biến thành những nơi sẽ phóng thích CO2.\n\nMột số nước đồng ý bảo tồn 30% diện tích đất trên trái đất, nhưng có thể cần bảo tồn phân nửa để khôi phục năng lực của hệ sinh thái đủ khả năng ứng phó thiệt hại.\n\nTác động của khí hậu đang tăng tốc nhanh với nhiều ảnh hưởng sẽ nghiêm trọng hơn dự báo và thế giới chỉ còn cơ hội ít ỏi nhằm tránh ảnh hưởng tồi tệ nhất đối với môi trường sống, theo tờ The Guardian ngày 28.2 dẫn báo cáo của Ủy ban Liên chính phủ về Biến đổi khí hậu (IPCC) thuộc Liên Hiệp Quốc.\n\nỞ mức hiện tại, hoạt động của con người đang làm khí hậu nóng lên, gây tác động diện rộng và nguy hiểm, đe dọa hủy hoại thế giới tự nhiên và khiến nhiều khu vực không còn sinh sống được nữa.\n\n“Chứng cứ khoa học là không thể nghi ngờ: biến đổi khí hậu là mối đe dọa đối với sức khỏe con người và hành tinh. Bất cứ sự trì hoãn nào đối với hành động phối hợp toàn cầu sẽ khiến thế giới bỏ lỡ cánh cửa hẹp đang khép nhanh để đảm bảo tương lai có thể sinh tồn”, theo ông Hans-Otto Pörtner, đồng chủ tịch một nhóm công tác của IPCC.\n\nBáo cáo được xem là “cảnh báo ảm đạm nhất” khi cho rằng hạn hán, lũ lụt, nắng nóng và những hiện tượng thời tiết cực đoan khác đang tăng tốc và gây thiệt hại gia tăng.\n\nViệc chỉ hạn chế mức tăng nhiệt độ trung bình toàn cầu lên 1,50C so với thời tiền công nghiệp vẫn sẽ gây ra những tác động không thể đảo ngược. Trong số đó có việc các sông băng, chóp băng tan chảy, các vùng ngập nước bị khô cạn và băng vĩnh cữu tan khiến nhiệt độ toàn cầu tăng thêm.\n\n“Bản án” cho nhân loại\nTổng thư ký Liên Hiệp Quốc Antonio Guterres chia sẻ rằng ông đã xem nhiều báo cáo khoa học nhưng chưa gặp báo cáo nào như lần này. Báo cáo của IPCC mô tả toàn cảnh về những gì con người hứng chịu và “bản án” dành cho việc quản lý khí hậu thất bại, theo ông Guterres.\n\nTheo báo cáo, mọi nơi sẽ bị ảnh hưởng, không khu vực sinh sống được nào thoát khỏi tác động nghiêm trọng từ việc nhiệt độ tăng và nhiều hiện tượng thời tiết cực đoan.\n\nMỹ, Trung Quốc bất ngờ công bố thỏa thuận về biến đổi khí hậu\nKhoảng phân nửa dân cư thế giới, từ 3,3-3,6 tỉ người sống trong những khu vực dễ bị tác động bởi biến đổi khí hậu. Hàng triệu người đối diện thiếu hụt nước, lương thực do biến đối khí hậu, thậm chí ở mức hiện tại.\n\nBên cạnh đó, hàng loạt các loài sinh vật bị biến mất, từ cây cối đến san hô, và điều nay đang diễn tiến. Những khu vực ven biển trên toàn cầu và những đảo nhỏ, thấp sẽ bị ngập. Những hệ sinh thái then chốt đang mất khả năng hấp thụ CO2 và biến thành những nơi sẽ phóng thích CO2.\n\nMột số nước đồng ý bảo tồn 30% diện tích đất trên trái đất, nhưng có thể cần bảo tồn phân nửa để khôi phục năng lực của hệ sinh thái đủ khả năng ứng phó thiệt hại.',
      },
      created_at: '2022-03-01T07:26:32.953062Z',
      updated_at: '2022-03-01T07:29:58.545615Z',
    },
    origin: null,
    own_reactions: {
      comment: [
        {
          created_at: '2022-03-01T08:10:40.656638Z',
          updated_at: '2022-03-01T08:10:40.656638Z',
          id: '04fe03d6-fdba-4374-b6b2-60a2cf32bca9',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '11',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-01T08:10:51.819025Z',
                updated_at: '2022-03-01T08:10:51.819025Z',
                id: '160a2b69-dccf-4d8b-acd9-2cbb6a53d53a',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
                data: {
                  content: '111',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '04fe03d6-fdba-4374-b6b2-60a2cf32bca9',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-03-01T07:29:17.013230Z',
          updated_at: '2022-03-01T07:29:17.013230Z',
          id: '97a7e0e5-698e-435b-9d1e-89915a63b485',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '10',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-01T07:29:15.449066Z',
          updated_at: '2022-03-01T07:29:15.449066Z',
          id: 'ea179110-36af-468b-a988-d81872ed624e',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '9',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-01T07:29:14.386283Z',
          updated_at: '2022-03-01T07:29:14.386283Z',
          id: '5a87789d-6512-498c-96c7-1b7fc41d9b82',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '8',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-03-01T07:29:12.565284Z',
          updated_at: '2022-03-01T07:29:12.565284Z',
          id: 'cf35f221-4bd2-43c8-9b6a-97a6778aa855',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {
            content: '7',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-01T08:20:30.499031Z',
          updated_at: '2022-03-01T08:20:30.499031Z',
          id: 'd7e35d8c-f79d-42fa-8d9e-1608199b82ff',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:10:51.856042Z',
          updated_at: '2022-03-01T08:10:51.856042Z',
          id: '02b8450d-9a24-457d-b3a5-c31952fc0a6b',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:10:40.684530Z',
          updated_at: '2022-03-01T08:10:40.684530Z',
          id: '557eedc8-453f-49b9-994b-91345bbec817',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:10:10.725603Z',
          updated_at: '2022-03-01T08:10:10.725603Z',
          id: 'd085f8dd-52f5-4a49-a3d2-1f03e3d396c8',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T08:09:58.492211Z',
          updated_at: '2022-03-01T08:09:58.492211Z',
          id: '9b3ee23d-0b19-4e8c-86ea-76b3ebeb8bbd',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '329d9c80-9931-11ec-8080-80012d314a0c',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    reaction_counts: {
      comment: 12,
      comment_count: 24,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-03-01T07:28:32.328000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:50:58.527007Z',
      updated_at: '2022-02-11T09:08:10.989228Z',
      id: '3',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
        fullname: 'Huỳnh Phương Khanh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '41866f83-87c3-4e83-a604-c245d92edcac',
    id: '7e5a2230-984e-11ec-8080-80013c7d8313',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-28T09:00:38.793751Z',
          updated_at: '2022-02-28T09:00:38.793751Z',
          id: '06dc5723-65af-40dc-baa9-8fddaeffb564',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'bbb',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-28T09:31:11.784627Z',
                updated_at: '2022-02-28T09:31:11.784627Z',
                id: 'de47d40c-b919-4ad4-b756-fe60b913417a',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '2',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:31:07.866240Z',
                updated_at: '2022-02-28T09:31:07.866240Z',
                id: 'bd41b7fe-561e-4dce-8e3e-e41fe8df627c',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '1',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:30:37.036106Z',
                updated_at: '2022-02-28T09:30:37.036106Z',
                id: '95ea138b-a715-495c-ba11-2eb3ed89b7b8',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Testing',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:29:56.139666Z',
                updated_at: '2022-02-28T09:29:56.139666Z',
                id: '0590cb4e-0e02-46d4-81be-b2d4fe5544c5',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Kk',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:29:45.941378Z',
                updated_at: '2022-02-28T09:29:45.941378Z',
                id: '383fb544-300a-4dea-9b9a-c5cdd73c361e',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Hehe',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:28:38.935955Z',
                updated_at: '2022-02-28T09:28:38.935955Z',
                id: '3f1ccc6b-40d1-4b3e-9413-41ee1ebdc28f',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Yooo',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:27:09.472415Z',
                updated_at: '2022-02-28T09:27:09.472415Z',
                id: '18bf51a9-2f23-4578-ac1c-dfb1a45a4066',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Hi',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:26:54.610763Z',
                updated_at: '2022-02-28T09:26:54.610763Z',
                id: '79371776-1b0f-4415-8ebe-151a5f0c6ac5',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Hello',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 8,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-02-28T09:00:36.118071Z',
          updated_at: '2022-02-28T09:00:36.118071Z',
          id: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'aaa',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-28T09:03:21.670481Z',
                updated_at: '2022-02-28T09:03:21.670481Z',
                id: '2389f61c-a072-42d1-b062-bd0d7628440c',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '3',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:03:21.668370Z',
                updated_at: '2022-02-28T09:03:21.668370Z',
                id: '22ee5624-204d-4e50-aae8-818cbf6e4a1a',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '3',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:01:30.025226Z',
                updated_at: '2022-02-28T09:01:30.025226Z',
                id: 'fa0b5788-a1f6-43e2-81ac-a10e7b9211ef',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '2',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:00:44.666732Z',
                updated_at: '2022-02-28T09:00:44.666732Z',
                id: '6c564cb6-d9e3-49fb-8d5a-b1d0c118f5d6',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '1',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 4,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-02-28T09:00:00.333759Z',
          updated_at: '2022-02-28T09:00:00.333759Z',
          id: '5f2e2321-d71a-4c5d-a5a9-feeb9d502a89',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'test',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-28T09:00:00.267452Z',
          updated_at: '2022-02-28T09:00:00.267452Z',
          id: '093aef0e-a27a-4be9-8990-d54ae22d27c0',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'test',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-28T09:00:00.252912Z',
          updated_at: '2022-02-28T09:00:00.252912Z',
          id: '2ff87041-13fd-4d9b-b52d-f481029fc9c5',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'test',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-28T09:31:11.809798Z',
          updated_at: '2022-02-28T09:31:11.809798Z',
          id: 'f34c86f6-c1e5-4d0d-8d70-b45c8977f6a8',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:31:07.895010Z',
          updated_at: '2022-02-28T09:31:07.895010Z',
          id: '5d73c916-c08f-42e6-98ef-a3ec61f63245',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:30:37.072500Z',
          updated_at: '2022-02-28T09:30:37.072500Z',
          id: '108fa925-769f-466f-afa3-6608d7cc8571',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:29:56.178094Z',
          updated_at: '2022-02-28T09:29:56.178094Z',
          id: '03a5b8f2-34a3-4db3-a39c-e8f317590bc3',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:29:45.980138Z',
          updated_at: '2022-02-28T09:29:45.980138Z',
          id: 'e07965d1-2497-4556-9026-d383a5216da3',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '92bf6fa5-ee41-4eef-9de4-2c4914a15abe',
      collection: 'post',
      foreign_id: 'post:92bf6fa5-ee41-4eef-9de4-2c4914a15abe',
      data: {
        images: [],
        videos: [],
        files: [],
        content:
          'Dạo quanh Feed đi tìm bugs\n###### Chủ đề số 1: Post dài ơi là dài kết hợp markdown đăng trên nhiều groups\n---\n__Advertisement :)__\n\n- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image\n  resize in browser.\n- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly\n  i18n with plurals support and easy syntax.\n\nYou will like those projects!\n\n---\n\n# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n\n## Horizontal Rules\n\n___\n\n---\n\n***\n\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## Blockquotes\n\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## Code\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code "fences"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ "title text!")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).\n\n\n### [Emojies](https://github.com/markdown-it/markdown-it-emoji)\n\n> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:\n>\n> Shortcuts (emoticons): :-) :-( 8-) ;)\n\nsee [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.\n\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O\n\n\n### [\\<ins>](https://github.com/markdown-it/markdown-it-ins)\n\n++Inserted text++\n\n\n### [\\<mark>](https://github.com/markdown-it/markdown-it-mark)\n\n==Marked text==\n\n\n### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)\n\nFootnote 1 link[^first].\n\nFootnote 2 link[^second].\n\nInline footnote^[Text of inline footnote] definition.\n\nDuplicated footnote reference[^second].\n\n[^first]: Footnote **can have markup**\n\n    and multiple paragraphs.\n\n[^second]: Footnote text.\n\n\n### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)\n\nTerm 1\n\n:   Definition 1\nwith lazy continuation.\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n_Compact style:_\n\nTerm 1\n  ~ Definition 1\n\nTerm 2\n  ~ Definition 2a\n  ~ Definition 2b\n\n\n### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)\n\nThis is HTML abbreviation example.\n\nIt converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.\n\n*[HTML]: Hyper Text Markup Language\n\n### [Custom containers](https://github.com/markdown-it/markdown-it-container)\n\n::: warning\n*here be dragons*\n:::\n',
      },
      created_at: '2022-02-28T04:25:17.675784Z',
      updated_at: '2022-02-28T04:25:29.579373Z',
    },
    origin: null,
    own_reactions: {
      comment: [
        {
          created_at: '2022-02-28T09:00:38.793751Z',
          updated_at: '2022-02-28T09:00:38.793751Z',
          id: '06dc5723-65af-40dc-baa9-8fddaeffb564',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'bbb',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-28T09:31:11.784627Z',
                updated_at: '2022-02-28T09:31:11.784627Z',
                id: 'de47d40c-b919-4ad4-b756-fe60b913417a',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '2',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:31:07.866240Z',
                updated_at: '2022-02-28T09:31:07.866240Z',
                id: 'bd41b7fe-561e-4dce-8e3e-e41fe8df627c',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '1',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:30:37.036106Z',
                updated_at: '2022-02-28T09:30:37.036106Z',
                id: '95ea138b-a715-495c-ba11-2eb3ed89b7b8',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Testing',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:29:56.139666Z',
                updated_at: '2022-02-28T09:29:56.139666Z',
                id: '0590cb4e-0e02-46d4-81be-b2d4fe5544c5',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Kk',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:29:45.941378Z',
                updated_at: '2022-02-28T09:29:45.941378Z',
                id: '383fb544-300a-4dea-9b9a-c5cdd73c361e',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Hehe',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:28:38.935955Z',
                updated_at: '2022-02-28T09:28:38.935955Z',
                id: '3f1ccc6b-40d1-4b3e-9413-41ee1ebdc28f',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Yooo',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:27:09.472415Z',
                updated_at: '2022-02-28T09:27:09.472415Z',
                id: '18bf51a9-2f23-4578-ac1c-dfb1a45a4066',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Hi',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:26:54.610763Z',
                updated_at: '2022-02-28T09:26:54.610763Z',
                id: '79371776-1b0f-4415-8ebe-151a5f0c6ac5',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: 'Hello',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-3'],
                parent: '06dc5723-65af-40dc-baa9-8fddaeffb564',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 8,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-02-28T09:00:36.118071Z',
          updated_at: '2022-02-28T09:00:36.118071Z',
          id: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'aaa',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-28T09:03:21.670481Z',
                updated_at: '2022-02-28T09:03:21.670481Z',
                id: '2389f61c-a072-42d1-b062-bd0d7628440c',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '3',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:03:21.668370Z',
                updated_at: '2022-02-28T09:03:21.668370Z',
                id: '22ee5624-204d-4e50-aae8-818cbf6e4a1a',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '3',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:01:30.025226Z',
                updated_at: '2022-02-28T09:01:30.025226Z',
                id: 'fa0b5788-a1f6-43e2-81ac-a10e7b9211ef',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '2',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T09:00:44.666732Z',
                updated_at: '2022-02-28T09:00:44.666732Z',
                id: '6c564cb6-d9e3-49fb-8d5a-b1d0c118f5d6',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
                data: {
                  content: '1',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '677e3fc0-ead8-4ec9-9bee-7e7cacb0523b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 4,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-02-28T09:00:00.333759Z',
          updated_at: '2022-02-28T09:00:00.333759Z',
          id: '5f2e2321-d71a-4c5d-a5a9-feeb9d502a89',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'test',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-28T09:00:00.267452Z',
          updated_at: '2022-02-28T09:00:00.267452Z',
          id: '093aef0e-a27a-4be9-8990-d54ae22d27c0',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'test',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-28T09:00:00.252912Z',
          updated_at: '2022-02-28T09:00:00.252912Z',
          id: '2ff87041-13fd-4d9b-b52d-f481029fc9c5',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {
            content: 'test',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-28T09:31:11.809798Z',
          updated_at: '2022-02-28T09:31:11.809798Z',
          id: 'f34c86f6-c1e5-4d0d-8d70-b45c8977f6a8',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:31:07.895010Z',
          updated_at: '2022-02-28T09:31:07.895010Z',
          id: '5d73c916-c08f-42e6-98ef-a3ec61f63245',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:03:21.707078Z',
          updated_at: '2022-02-28T09:03:21.707078Z',
          id: '70be6341-fb9b-4afd-a4c0-359aba3bf8b4',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:03:21.701451Z',
          updated_at: '2022-02-28T09:03:21.701451Z',
          id: '962fb311-bf7e-4216-a0e6-bce1aa25303b',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T09:01:30.047938Z',
          updated_at: '2022-02-28T09:01:30.047938Z',
          id: '72560011-4fce-4c00-886c-eed56975db77',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '7e5a2230-984e-11ec-8080-80013c7d8313',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    reaction_counts: {
      comment: 21,
      comment_count: 61,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-28T04:25:43.635000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-11T02:46:10.540203Z',
      updated_at: '2022-03-14T10:59:10.736036Z',
      id: '33',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        fullname: 'Nguyễn Thị Ngọc Linh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '6c31637d-2f45-478b-a1c8-e5016e9d6e31',
    id: 'f83888f0-97a7-11ec-8080-80007d572722',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-27T09:17:40.842584Z',
          updated_at: '2022-02-28T10:48:50.728950Z',
          id: 'b4c18a42-f5c0-4b64-a309-f871a78e5752',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'f83888f0-97a7-11ec-8080-80007d572722',
          data: {
            content: 'Byeeeeeeeeeee @thuquyen @ngoclinh ',
            edited: true,
            images: [
              {
                height: 1200,
                name: '8efcd794-5d5b-4f24-bb5d-392441cc87f9.png',
                origin_name: '1200x1200.png',
                width: 1200,
              },
            ],
            mentions: {
              users: {
                ngoclinh: {
                  id: '33',
                  data: {
                    username: 'ngoclinh',
                    fullname: 'Nguyễn Thị Ngọc Linh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                  },
                },
                thuquyen: {
                  id: '58',
                  data: {
                    username: 'thuquyen',
                    fullname: 'Nguyen Thi Thu Quyền',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
                  },
                },
              },
              groups: {},
            },
          },
          parent: '',
          latest_children: {
            rolling_on_the_floor_laughing: [
              {
                id: '11683aee-a62c-40c2-8832-1218ee8db6d1',
                user_id: '3',
                user: {
                  id: '3',
                  data: {
                    fullname: 'Huỳnh Phương Khanh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                  },
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                },
                kind: 'rolling_on_the_floor_laughing',
                parent: 'b4c18a42-f5c0-4b64-a309-f871a78e5752',
                activity_id: 'f83888f0-97a7-11ec-8080-80007d572722',
                created_at: '2022-02-28T03:31:31.691150Z',
                updated_at: '2022-02-28T03:31:31.691150Z',
              },
              {
                id: '0fe78b7d-540f-4dad-b9bc-d93f328c8d61',
                user_id: '33',
                user: {
                  id: '33',
                  data: {
                    fullname: 'Nguyễn Thị Ngọc Linh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
                  },
                  created_at: '2022-01-11T02:46:10.540203Z',
                  updated_at: '2022-03-14T10:59:10.736036Z',
                },
                kind: 'rolling_on_the_floor_laughing',
                parent: 'b4c18a42-f5c0-4b64-a309-f871a78e5752',
                activity_id: 'f83888f0-97a7-11ec-8080-80007d572722',
                created_at: '2022-02-27T09:29:14.749120Z',
                updated_at: '2022-02-27T09:29:14.749120Z',
              },
            ],
          },
          own_children: {
            rolling_on_the_floor_laughing: [
              {
                id: '11683aee-a62c-40c2-8832-1218ee8db6d1',
                user_id: '3',
                user: {
                  id: '3',
                  data: {
                    fullname: 'Huỳnh Phương Khanh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                  },
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                },
                kind: 'rolling_on_the_floor_laughing',
                parent: 'b4c18a42-f5c0-4b64-a309-f871a78e5752',
                activity_id: 'f83888f0-97a7-11ec-8080-80007d572722',
                created_at: '2022-02-28T03:31:31.691150Z',
                updated_at: '2022-02-28T03:31:31.691150Z',
              },
            ],
          },
          children_counts: {
            rolling_on_the_floor_laughing: 2,
            comment_count: 0,
          },
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-27T09:17:40.886445Z',
          updated_at: '2022-02-27T09:17:40.886445Z',
          id: '25327144-268f-4a4a-a05e-ea92762c9be4',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'f83888f0-97a7-11ec-8080-80007d572722',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: 'a0c01619-bfe8-47e5-859a-11452fc87290',
      collection: 'post',
      foreign_id: 'post:a0c01619-bfe8-47e5-859a-11452fc87290',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'helo helo helo',
      },
      created_at: '2022-02-27T08:32:22.892664Z',
      updated_at: '2022-02-27T08:32:28.728856Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 1,
      comment_count: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-27T08:33:42.143000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'bbe722d7-fec5-46e5-afd8-cd0eb3620a55',
    id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-25T09:40:46.266385Z',
          updated_at: '2022-03-01T10:44:07.556878Z',
          id: 'a19a26d3-6c55-4e83-a848-4edff224243b',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {
            content: 'Hhhh',
            edited: true,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-28T03:48:32.419527Z',
                updated_at: '2022-02-28T03:48:32.419527Z',
                id: '27dd6373-2ce4-4ef6-80e0-eea7ca8138d8',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
                data: {
                  content: 'hmmm',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: 'a19a26d3-6c55-4e83-a848-4edff224243b',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:25:36.833678Z',
          updated_at: '2022-02-25T09:25:36.833678Z',
          id: '0490271f-3d21-4a7a-9610-cb7e1f6b29fc',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {
            content: 'A',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-28T03:48:18.763906Z',
                updated_at: '2022-02-28T03:48:18.763906Z',
                id: 'a9297c31-ea9f-4705-8716-459f9ee6643e',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
                data: {
                  content: 'Hehe',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: '0490271f-3d21-4a7a-9610-cb7e1f6b29fc',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T03:48:09.989837Z',
                updated_at: '2022-02-28T03:48:09.989837Z',
                id: '14f6b14d-f37f-46b0-80e9-ff4ee6af90eb',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
                data: {
                  content: 'Test reply',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: '0490271f-3d21-4a7a-9610-cb7e1f6b29fc',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-28T03:48:02.359537Z',
                updated_at: '2022-02-28T03:48:02.359537Z',
                id: 'ed162cda-165c-45d5-8888-86e01a0a0e51',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
                data: {
                  content: '@trannamanh hello',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      trannamanh: {
                        id: '2',
                        data: {
                          username: 'trannamanh',
                          fullname: 'Trần Nam Anh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: '0490271f-3d21-4a7a-9610-cb7e1f6b29fc',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 3,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:24:35.014375Z',
          updated_at: '2022-02-28T09:27:04.205612Z',
          id: '9a72748a-0e07-4966-a18d-1d5a15178120',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {
            content: 'Aaabbb',
            edited: true,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:22:09.078315Z',
          updated_at: '2022-03-01T10:52:15.275196Z',
          id: '105bbf85-ff31-4d9e-bd3f-4c600207e414',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {
            content: 'Ssdsss',
            edited: true,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:21:52.963194Z',
          updated_at: '2022-02-28T01:32:12.858252Z',
          id: '7fff65e9-c68f-4fd1-9b17-1d186b289701',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {
            content: 'Aaaaa',
            edited: true,
            images: [
              {
                height: 1395,
                name: '6d5ff731-30e8-4973-a8fd-a5814539dd56.jpg',
                origin_name: 'd4b6d982f57acd167cb98ed0a6d4ce7b.jpg',
                width: 1097,
              },
            ],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-28T03:48:32.464387Z',
          updated_at: '2022-02-28T03:48:32.464387Z',
          id: '9fe706b3-3cc4-40a5-9916-8618df968395',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T03:48:18.793386Z',
          updated_at: '2022-02-28T03:48:18.793386Z',
          id: 'd700f7c9-c34d-41a7-bada-d87f734ae223',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T03:48:10.021150Z',
          updated_at: '2022-02-28T03:48:10.021150Z',
          id: '6f25b714-f94a-4d5b-94f9-46b87ffcafc1',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-28T03:48:02.447326Z',
          updated_at: '2022-02-28T03:48:02.447326Z',
          id: '9512a4cb-c9f3-43b7-a27c-da1290e8504d',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-25T09:40:46.290057Z',
          updated_at: '2022-02-25T09:40:46.290057Z',
          id: '08370bb7-9346-466d-bff1-775f41fd72d6',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      joy: [
        {
          id: '2517f81d-8e74-48fe-9cea-04a8368eec81',
          user_id: '58',
          user: {
            id: '58',
            data: {
              fullname: 'Nguyen Thi Thu Quyền',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
            },
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
          },
          kind: 'joy',
          parent: '',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          created_at: '2022-02-25T09:47:29.904369Z',
          updated_at: '2022-02-25T09:47:29.904369Z',
        },
      ],
      rolling_on_the_floor_laughing: [
        {
          id: 'e7255d66-3b82-43ad-abd7-47d8e4f6e378',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'rolling_on_the_floor_laughing',
          parent: '',
          activity_id: '1b06b5f0-95fa-11ec-8080-800164cdd813',
          created_at: '2022-02-27T08:28:15.088867Z',
          updated_at: '2022-02-27T08:28:15.088867Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {
        trankimmai: {
          id: '40',
          data: {
            username: 'trankimmai',
            fullname: 'Trần Thị Kim Mai',
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
          },
          created_at: '2022-01-11T02:46:13.178254Z',
          updated_at: '2022-01-11T02:46:13.178254Z',
        },
      },
      groups: {},
    },
    object: {
      id: 'c93895ed-198b-47e3-89b9-aa2322ad15ba',
      collection: 'post',
      foreign_id: 'post:c93895ed-198b-47e3-89b9-aa2322ad15ba',
      data: {
        images: [],
        videos: [],
        files: [],
        content: '@trankimmai ',
      },
      created_at: '2022-02-25T05:16:31.623233Z',
      updated_at: '2022-02-25T05:16:36.540977Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 11,
      comment_count: 15,
      joy: 1,
      rolling_on_the_floor_laughing: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-25T05:16:36.943000',
    type: 'post',
    verb: 'post',
    reactions_order: ['joy', 'rolling_on_the_floor_laughing'],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '9654c27b-bd4c-478b-93f5-702df832e12e',
    id: '4e419bb0-9569-11ec-8080-800055f93c41',
    important: {
      active: false,
      expires_time: null,
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-25T09:33:13.939876Z',
          updated_at: '2022-02-25T09:33:13.939876Z',
          id: 'af03195d-fe19-4244-9ea1-58662f7e2ef0',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {
            content: '',
            edited: false,
            images: [
              {
                height: 1600,
                name: 'fecb107b-28ae-4221-85ab-c7ebdb4e8f60.png',
                origin_name: 'Screenshot_20220225-162606.png',
                width: 720,
              },
            ],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:31:33.674721Z',
          updated_at: '2022-02-25T09:31:33.674721Z',
          id: '659adc02-1c8e-4ba3-a4c0-dc3aef218075',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {
            content: 'Q',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:13:24.823737Z',
          updated_at: '2022-02-25T09:13:24.823737Z',
          id: '36503785-f121-4466-b343-d8a06521599d',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {
            content:
              'Qasssssssssssssssssssssssssssssswwwwssssswwwqqqazzzaaazzsaa',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:09:44.989465Z',
          updated_at: '2022-02-25T09:09:44.989465Z',
          id: 'd522d013-9575-4f53-9d93-8ec080f65b42',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {
            content: 'Qawwwqqq',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:01:35.803883Z',
          updated_at: '2022-02-25T09:01:35.803883Z',
          id: '1b8d856d-1b03-45d3-a089-0a571e1e76d5',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {
            content: 'Q',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-25T09:33:13.965767Z',
          updated_at: '2022-02-25T09:33:13.965767Z',
          id: '46246068-c698-40db-bf18-720b13a957c6',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-25T09:31:33.702890Z',
          updated_at: '2022-02-25T09:31:33.702890Z',
          id: '470ba081-2ee3-4400-bbb4-584f1836ae98',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-25T09:13:24.906910Z',
          updated_at: '2022-02-25T09:13:24.906910Z',
          id: 'a43f118f-7fb4-40fa-aa91-806bba401a78',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-25T09:09:45.024314Z',
          updated_at: '2022-02-25T09:09:45.024314Z',
          id: '67953cb4-9593-4dbe-b8ab-ebfc00b05b96',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-25T09:01:35.830396Z',
          updated_at: '2022-02-25T09:01:35.830396Z',
          id: '4280454e-f075-4b11-9b4d-e368a2fdb9f0',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      grinning: [
        {
          id: '627b8324-3a14-402d-a8d1-565d01821901',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'grinning',
          parent: '',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          created_at: '2022-02-25T01:39:48.337761Z',
          updated_at: '2022-02-25T01:39:48.337761Z',
        },
      ],
      grinning_face_with_star_eyes: [
        {
          id: '24215cc8-bace-4e77-b464-34dccd02beed',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'grinning_face_with_star_eyes',
          parent: '',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          created_at: '2022-02-25T01:39:45.772607Z',
          updated_at: '2022-02-25T01:39:45.772607Z',
        },
      ],
      kissing_smiling_eyes: [
        {
          id: '05835947-f18a-42a2-992e-4ec03cd01cc5',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'kissing_smiling_eyes',
          parent: '',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          created_at: '2022-02-25T01:39:42.838038Z',
          updated_at: '2022-02-25T01:39:42.838038Z',
        },
      ],
      wink: [
        {
          id: 'b99cbc45-1e9d-4ee2-a3ea-8f556cc6f981',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'wink',
          parent: '',
          activity_id: '4e419bb0-9569-11ec-8080-800055f93c41',
          created_at: '2022-02-25T01:39:44.505716Z',
          updated_at: '2022-02-25T01:39:44.505716Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '0cd3f727-d54b-4688-900b-d1fbee3e8e9f',
      collection: 'post',
      foreign_id: 'post:0cd3f727-d54b-4688-900b-d1fbee3e8e9f',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Dont \n@thuquyen ',
      },
      created_at: '2022-02-24T12:00:04.216943Z',
      updated_at: '2022-02-25T05:15:46.254457Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 6,
      comment_count: 6,
      grinning: 1,
      grinning_face_with_star_eyes: 1,
      kissing_smiling_eyes: 1,
      wink: 1,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-24T12:00:05.867000',
    type: 'post',
    verb: 'post',
    reactions_order: [
      'kissing_smiling_eyes',
      'wink',
      'grinning_face_with_star_eyes',
      'grinning',
    ],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '56ae8b33-e66a-4dbf-b23a-bec212c1d393',
    id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-03-01T03:58:54.707864Z',
          updated_at: '2022-03-01T03:58:54.707864Z',
          id: '65fc03d2-47a5-4d78-a789-abcc4d3e7b50',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {
            content: 'New',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T09:37:10.725489Z',
          updated_at: '2022-02-25T09:37:10.725489Z',
          id: '1d8d12fb-b393-4be1-9d19-964d0aa383a9',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {
            content: 'Q',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-01T03:46:32.627277Z',
                updated_at: '2022-03-01T03:46:32.627277Z',
                id: 'aede6ee4-76c1-487b-8cfd-e2d9255852e2',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '4',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: '1d8d12fb-b393-4be1-9d19-964d0aa383a9',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:46:18.770134Z',
                updated_at: '2022-03-01T03:46:18.770134Z',
                id: '011d0ee9-a0a4-4601-ba6d-92cdf871e688',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '3',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: '1d8d12fb-b393-4be1-9d19-964d0aa383a9',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:45:54.604335Z',
                updated_at: '2022-03-01T03:45:54.604335Z',
                id: '88c9e441-8a5f-47d7-a8f5-cd829731f909',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '2',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: '1d8d12fb-b393-4be1-9d19-964d0aa383a9',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:45:42.679591Z',
                updated_at: '2022-03-01T03:45:42.679591Z',
                id: '23510508-3656-4f0a-9dd7-ec90b526d5d4',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: 'Test',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: '1d8d12fb-b393-4be1-9d19-964d0aa383a9',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 4,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T07:05:56.167972Z',
          updated_at: '2022-02-25T07:05:56.167972Z',
          id: 'ed3c81b1-ae8c-4d8e-9584-840ac98f2349',
          user_id: '35',
          user: {
            created_at: '2022-01-11T02:46:11.166110Z',
            updated_at: '2022-01-11T02:46:11.166110Z',
            id: '35',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Văn Toàn',
              username: 'nvantoan',
            },
          },
          kind: 'comment',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {
            content: '8',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-01T03:47:29.604386Z',
                updated_at: '2022-03-01T03:47:29.604386Z',
                id: '4463b269-9c7a-4d68-93c1-afeee499ac1c',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '5',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'ed3c81b1-ae8c-4d8e-9584-840ac98f2349',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:47:22.842796Z',
                updated_at: '2022-03-01T03:47:22.842796Z',
                id: '40036c4a-8859-48e7-88cb-ef7781baaa0d',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '4',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'ed3c81b1-ae8c-4d8e-9584-840ac98f2349',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:47:17.661570Z',
                updated_at: '2022-03-01T03:47:17.661570Z',
                id: '6f99e765-f758-4cb3-ae3d-d9d34138aaf8',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '3',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'ed3c81b1-ae8c-4d8e-9584-840ac98f2349',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:47:09.490070Z',
                updated_at: '2022-03-01T03:47:09.490070Z',
                id: 'e83a1b62-c988-4982-9558-9601aa0ef8ba',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '2',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'ed3c81b1-ae8c-4d8e-9584-840ac98f2349',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:47:03.406088Z',
                updated_at: '2022-03-01T03:47:03.406088Z',
                id: '412154f5-cc68-4e93-9953-ae1a5572ce94',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '1',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'ed3c81b1-ae8c-4d8e-9584-840ac98f2349',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 5,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T07:05:54.067057Z',
          updated_at: '2022-02-25T07:05:54.067057Z',
          id: 'a1da8764-b74c-4135-854d-2f3810894048',
          user_id: '35',
          user: {
            created_at: '2022-01-11T02:46:11.166110Z',
            updated_at: '2022-01-11T02:46:11.166110Z',
            id: '35',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Văn Toàn',
              username: 'nvantoan',
            },
          },
          kind: 'comment',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {
            content: '7',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-03-01T03:56:48.914735Z',
                updated_at: '2022-03-01T03:56:48.914735Z',
                id: 'ad7b5fbd-1522-47aa-b98d-1d0953287873',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '44',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'a1da8764-b74c-4135-854d-2f3810894048',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:53:32.109577Z',
                updated_at: '2022-03-01T03:53:32.109577Z',
                id: '8d68c16c-9f58-479e-85fc-1964a1138977',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '33',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'a1da8764-b74c-4135-854d-2f3810894048',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:53:23.692956Z',
                updated_at: '2022-03-01T03:53:23.692956Z',
                id: 'd50cb1ff-9e80-45d4-bfc4-15af5ef8bfe0',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '22',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'a1da8764-b74c-4135-854d-2f3810894048',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-03-01T03:53:09.346215Z',
                updated_at: '2022-03-01T03:53:09.346215Z',
                id: '4887b9c6-9c63-4fb3-bde9-604c19601431',
                user_id: '12',
                user: {
                  created_at: '2022-01-10T10:03:39.466126Z',
                  updated_at: '2022-03-11T07:04:59.118656Z',
                  id: '12',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
                    fullname: 'Diem Trang',
                  },
                },
                kind: 'comment',
                activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
                data: {
                  content: '@nvantoan 777',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      nvantoan: {
                        id: '35',
                        data: {
                          username: 'nvantoan',
                          fullname: 'Nguyễn Văn Toàn',
                          avatar:
                            'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-35'],
                parent: 'a1da8764-b74c-4135-854d-2f3810894048',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          children_counts: {
            comment: 4,
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-25T07:05:49.918006Z',
          updated_at: '2022-02-25T07:05:49.918006Z',
          id: 'c30cd107-b3ae-4803-b85a-386828888bab',
          user_id: '35',
          user: {
            created_at: '2022-01-11T02:46:11.166110Z',
            updated_at: '2022-01-11T02:46:11.166110Z',
            id: '35',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Nguyễn Văn Toàn',
              username: 'nvantoan',
            },
          },
          kind: 'comment',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {
            content: '6',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-03-01T03:58:54.745526Z',
          updated_at: '2022-03-01T03:58:54.745526Z',
          id: '235c312d-086e-469c-8d7d-865136969434',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T03:56:49.001474Z',
          updated_at: '2022-03-01T03:56:49.001474Z',
          id: 'a7d0aa1e-635b-41cd-a989-ca28825b3778',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T03:53:32.150372Z',
          updated_at: '2022-03-01T03:53:32.150372Z',
          id: '3bb96003-debf-4ccd-9f26-97d97ebf1a8a',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T03:53:23.726100Z',
          updated_at: '2022-03-01T03:53:23.726100Z',
          id: 'bf754893-843e-44a8-a4e3-4eac9f451726',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-03-01T03:53:09.416417Z',
          updated_at: '2022-03-01T03:53:09.416417Z',
          id: 'f6494c89-dca5-44f0-bcaf-1eca0d927d7f',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: '2a9dcbf0-9566-11ec-8080-800131fe39a4',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: 'b855ef04-5f36-43b7-9977-e4123fce90d4',
      collection: 'post',
      foreign_id: 'post:b855ef04-5f36-43b7-9977-e4123fce90d4',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Delete cmt',
      },
      created_at: '2022-02-24T11:37:34.035952Z',
      updated_at: '2022-02-24T11:37:37.047807Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 14,
      comment_count: 34,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-24T11:37:37.583000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'da10052a-c77b-4fb6-85df-02870299db58',
    id: '8f0417c0-9499-11ec-8080-800101ae6a84',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-24T08:34:09.338695Z',
          updated_at: '2022-02-24T08:34:09.338695Z',
          id: 'e51a6d3a-7e16-4770-9ef4-1b44247b5e03',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-24T08:34:08.511571Z',
          updated_at: '2022-02-24T08:34:08.511571Z',
          id: '65c374bf-a8cf-4220-b185-a00888223d77',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-24T05:05:28.806706Z',
          updated_at: '2022-02-24T05:05:28.806706Z',
          id: 'c0ffc532-c531-4949-a75d-6a5ea44f3aca',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: 'Lqlalala',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-28T03:52:22.010130Z',
                updated_at: '2022-02-28T03:52:22.010130Z',
                id: 'd535732f-8e0a-4ff1-aa12-8ead1f5ed4b5',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
                data: {
                  content: '@trannamanh hmm',
                  edited: false,
                  images: [],
                  mentions: {
                    users: {
                      trannamanh: {
                        id: '2',
                        data: {
                          username: 'trannamanh',
                          fullname: 'Trần Nam Anh',
                          avatar:
                            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
                        },
                      },
                    },
                    groups: {},
                  },
                },
                target_feeds: ['notification:u-2'],
                parent: 'c0ffc532-c531-4949-a75d-6a5ea44f3aca',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 1,
            comment_count: 0,
          },
        },
        {
          created_at: '2022-02-24T05:05:24.878205Z',
          updated_at: '2022-02-24T05:05:24.878205Z',
          id: '3f13b2fd-6e7e-47d1-84e9-8c80518937f0',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: 'Lalal',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-24T05:05:20.217229Z',
          updated_at: '2022-02-24T05:05:20.217229Z',
          id: '25c04722-0df0-4a23-9c76-403e6f1339ef',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: 'Lalala',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-28T03:52:22.124405Z',
          updated_at: '2022-02-28T03:52:22.124405Z',
          id: '9fa72dde-7161-4ed3-b980-0adbdc99cbe3',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T08:34:09.379526Z',
          updated_at: '2022-02-24T08:34:09.379526Z',
          id: 'dd6bc83e-922f-41bd-aa32-7e488fdab285',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T08:34:08.549036Z',
          updated_at: '2022-02-24T08:34:08.549036Z',
          id: '40190442-8eb3-4e60-8290-628f940f6d13',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T05:05:28.832654Z',
          updated_at: '2022-02-24T05:05:28.832654Z',
          id: '8307f6a6-d14e-4ef2-bac8-0192b41c22d8',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T05:05:24.912318Z',
          updated_at: '2022-02-24T05:05:24.912318Z',
          id: '39508a8d-1973-4b44-9278-dca61a8025f7',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      grin: [
        {
          id: '3d877cc3-a799-45d9-ace0-746a4940b926',
          user_id: '59',
          user: {
            id: '59',
            data: {
              fullname: 'Diệp Phi Đằng',
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              username: 'dphidang',
            },
            created_at: '2022-02-08T08:03:22.268523Z',
            updated_at: '2022-02-08T08:03:22.268523Z',
          },
          kind: 'grin',
          parent: '',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          created_at: '2022-02-24T10:43:03.835152Z',
          updated_at: '2022-02-24T10:43:03.835152Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: 'e05067d4-62bc-4f59-b1fd-0e5d9428975d',
      collection: 'post',
      foreign_id: 'post:e05067d4-62bc-4f59-b1fd-0e5d9428975d',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Delete comment',
      },
      created_at: '2022-02-23T11:12:56.661257Z',
      updated_at: '2022-02-23T11:12:58.68648Z',
    },
    origin: null,
    own_reactions: {
      comment: [
        {
          created_at: '2022-02-24T08:34:09.338695Z',
          updated_at: '2022-02-24T08:34:09.338695Z',
          id: 'e51a6d3a-7e16-4770-9ef4-1b44247b5e03',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-24T08:34:08.511571Z',
          updated_at: '2022-02-24T08:34:08.511571Z',
          id: '65c374bf-a8cf-4220-b185-a00888223d77',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-24T02:11:29.467687Z',
          updated_at: '2022-02-24T02:11:29.467687Z',
          id: '508f1012-ba74-4b8e-b920-bfd666f4c6a6',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {
            content: 'test',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {
            comment: [
              {
                created_at: '2022-02-24T02:58:27.733988Z',
                updated_at: '2022-02-24T02:58:27.733988Z',
                id: '02be3a9a-d14c-4414-8340-5a50e227fbac',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
                data: {
                  content:
                    'Newcomers to automated testing—and unit testing in particular—often get confused when it comes to assessing the quality of their test cases. How can you know that the tests you write really verify your app is working correctly? Is it possible to know for sure whether the tests you have are enough for your application? A resource that engineers often resort to in cases like these is metrics. Tracking important metrics is a valuable way to get an objective assessment of many facets of software development, and testing is no different. In today’s post, we’ll tackle a metric called branch coverage. What is it? What does this metric really tell you? And what are its limitations? This is what we’ll discuss in this post.\n\nWe’ll start answering the “what” question by providing a quick definition of branch coverage. We’ll then follow that with an explanation of how it differs from other metrics with similar names, such as code coverage and statement coverage, to name a few. After that, we’ll delve deeper into the concept of branch coverage. We’ll provide examples, explaining the ways in which this metric can be useful. Finally, we’ll also explain some of the important limitations of this metric. By the end of the post, you’ll not only know what branch coverage is, but you’ll also have a solid understanding of what this metric does and doesn’t tell you.\n\nLet’s get started.',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '508f1012-ba74-4b8e-b920-bfd666f4c6a6',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
              {
                created_at: '2022-02-24T02:33:25.177825Z',
                updated_at: '2022-02-24T02:33:25.177825Z',
                id: 'a58c8fa3-5b49-4085-9bf4-c41af2ded4f7',
                user_id: '3',
                user: {
                  created_at: '2022-01-10T03:50:58.527007Z',
                  updated_at: '2022-02-11T09:08:10.989228Z',
                  id: '3',
                  data: {
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
                    fullname: 'Huỳnh Phương Khanh',
                  },
                },
                kind: 'comment',
                activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
                data: {
                  content: 'reply',
                  edited: false,
                  images: [],
                  mentions: {
                    groups: [],
                    users: [],
                  },
                },
                parent: '508f1012-ba74-4b8e-b920-bfd666f4c6a6',
                latest_children: {},
                children_counts: {
                  comment_count: 0,
                },
                own_children: {},
              },
            ],
          },
          own_children: {},
          children_counts: {
            comment: 2,
            comment_count: 0,
          },
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-28T03:52:22.124405Z',
          updated_at: '2022-02-28T03:52:22.124405Z',
          id: '9fa72dde-7161-4ed3-b980-0adbdc99cbe3',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T08:34:09.379526Z',
          updated_at: '2022-02-24T08:34:09.379526Z',
          id: 'dd6bc83e-922f-41bd-aa32-7e488fdab285',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T08:34:08.549036Z',
          updated_at: '2022-02-24T08:34:08.549036Z',
          id: '40190442-8eb3-4e60-8290-628f940f6d13',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T02:58:27.761190Z',
          updated_at: '2022-02-24T02:58:27.761190Z',
          id: '909898d8-2782-4f1b-b160-2de1321096bd',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-24T02:33:25.211960Z',
          updated_at: '2022-02-24T02:33:25.211960Z',
          id: '980c9f47-028e-4438-a6e3-14eaec9ce6c3',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: '8f0417c0-9499-11ec-8080-800101ae6a84',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    reaction_counts: {
      comment: 48,
      comment_count: 51,
      grin: 1,
      satisfied: 0,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-23T11:12:59.196000',
    type: 'post',
    verb: 'post',
    reactions_order: ['grin'],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '1c2c5f72-72c6-4f5b-91d2-ebd524a0e458',
    id: 'b3f793a0-9489-11ec-8080-800146255c2f',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-23T09:29:13.972001Z',
          updated_at: '2022-02-23T09:29:13.972001Z',
          id: '7f4f5258-37c2-49d2-9272-b973bba15235',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {
            content: '19',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:29:13.239875Z',
          updated_at: '2022-02-23T09:29:13.239875Z',
          id: '130c9060-6f04-4fbc-a85b-aa45f1d1acde',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {
            content: '18',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:29:03.295743Z',
          updated_at: '2022-02-23T09:29:03.295743Z',
          id: 'fd2cdb2d-4ab7-4c6a-bd45-19de40c4cd29',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {
            content: '17',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:29:02.369506Z',
          updated_at: '2022-02-23T09:29:02.369506Z',
          id: 'ad544ba5-98ac-4660-9c08-7def020b2631',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {
            content: '16',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:29:01.314533Z',
          updated_at: '2022-02-23T09:29:01.314533Z',
          id: '017838a0-90e0-4929-a9bf-754500aae593',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {
            content: '15',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-23T11:08:49.198699Z',
          updated_at: '2022-02-23T11:08:49.198699Z',
          id: 'f3806bde-29fe-416a-b586-ee8de8ee519f',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:29:15.306703Z',
          updated_at: '2022-02-23T09:29:15.306703Z',
          id: '13b91b8a-4d5d-4080-a982-ace65e8087be',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:29:14.008481Z',
          updated_at: '2022-02-23T09:29:14.008481Z',
          id: 'd880b82d-851e-462f-8e1a-b53f594257e0',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:29:13.268417Z',
          updated_at: '2022-02-23T09:29:13.268417Z',
          id: '7c5e1ffd-1cab-4956-a7d9-2c2c3685cc78',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:29:03.324611Z',
          updated_at: '2022-02-23T09:29:03.324611Z',
          id: '2c911fbf-276e-426a-be27-fcb60776bd4a',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b3f793a0-9489-11ec-8080-800146255c2f',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: 'dccf3831-c7ae-47b7-845a-58c0884cdbd8',
      collection: 'post',
      foreign_id: 'post:dccf3831-c7ae-47b7-845a-58c0884cdbd8',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'đau lòng',
      },
      created_at: '2022-02-23T09:19:25.729642Z',
      updated_at: '2022-02-23T09:19:28.856978Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 19,
      comment_count: 19,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-23T09:19:29.242000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-11T02:46:10.540203Z',
      updated_at: '2022-03-14T10:59:10.736036Z',
      id: '33',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
        fullname: 'Nguyễn Thị Ngọc Linh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '76b07457-aaff-45c4-a54f-3993f9bfa2ce',
    id: '5be1fc50-9489-11ec-8080-80016be1dc18',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-23T09:17:15.689739Z',
          updated_at: '2022-02-23T09:17:15.689739Z',
          id: '816fc8f6-a039-45c3-ac06-b5e49da27592',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {
            content: 'e',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:17:09.188851Z',
          updated_at: '2022-02-23T09:17:09.188851Z',
          id: '3019f535-2141-4fc6-a199-7d871b77c168',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {
            content: 'd',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:17:06.388477Z',
          updated_at: '2022-02-23T09:17:06.388477Z',
          id: 'cf6e3a75-4e62-4ca2-bf0a-d149ba52c90f',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {
            content: 'c',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:17:05.127078Z',
          updated_at: '2022-02-23T09:17:05.127078Z',
          id: 'e5a4842d-82b0-4855-b373-ad3cd6fe36a1',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {
            content: 'b',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T09:17:04.503233Z',
          updated_at: '2022-02-23T09:17:04.503233Z',
          id: '1076fca5-80ae-49b7-ab4c-772459fcf203',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {
            content: 'a',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-23T09:17:15.716284Z',
          updated_at: '2022-02-23T09:17:15.716284Z',
          id: '4f84d87b-57c7-4bd6-ba6c-807bf93ef9b1',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:17:09.211199Z',
          updated_at: '2022-02-23T09:17:09.211199Z',
          id: '98c22405-3896-4d18-ad14-40f8b9abb6f0',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:17:06.414663Z',
          updated_at: '2022-02-23T09:17:06.414663Z',
          id: '88e5ee38-3791-4c23-99fa-0d697a8068e3',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:17:05.149028Z',
          updated_at: '2022-02-23T09:17:05.149028Z',
          id: '05c71cbe-301c-4b8d-ba27-8ce960d184ac',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T09:17:04.535003Z',
          updated_at: '2022-02-23T09:17:04.535003Z',
          id: '8f1e843c-5d2c-4734-bc80-72bbd26b58f7',
          user_id: '33',
          user: {
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
            id: '33',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
              fullname: 'Nguyễn Thị Ngọc Linh',
            },
          },
          kind: 'comment_count',
          activity_id: '5be1fc50-9489-11ec-8080-80016be1dc18',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '82f20df2-3d2c-4c61-a9e6-8bcc449aaee1',
      collection: 'post',
      foreign_id: 'post:82f20df2-3d2c-4c61-a9e6-8bcc449aaee1',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'test nha',
      },
      created_at: '2022-02-23T09:16:59.854148Z',
      updated_at: '2022-02-23T09:17:00.940981Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 5,
      comment_count: 5,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-23T09:17:01.461000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '4093454c-e3e0-4558-936e-2f2d0028a678',
    id: 'ad268900-9385-11ec-8080-80013035c5f7',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-23T10:41:30.604604Z',
          updated_at: '2022-02-23T10:41:30.604604Z',
          id: 'e4a0c755-78dc-4984-abc1-48f0632c323a',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T10:41:27.304786Z',
          updated_at: '2022-02-23T10:41:27.304786Z',
          id: '0713f938-2e90-46ac-a3c6-7d6484067ba7',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T10:41:23.748181Z',
          updated_at: '2022-02-23T10:41:23.748181Z',
          id: '216044bf-b971-451c-84e0-9b5b769a3ab3',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T10:40:45.556854Z',
          updated_at: '2022-02-23T10:40:45.556854Z',
          id: 'ed7e7a06-aef6-4166-8a54-21494577e027',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-23T10:40:35.148790Z',
          updated_at: '2022-02-23T10:40:35.148790Z',
          id: '3a5d5936-23e3-4ae3-899a-71ebe8b2f634',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-23T10:41:30.636935Z',
          updated_at: '2022-02-23T10:41:30.636935Z',
          id: '5925baaa-488a-486f-9410-b3a6c4372a18',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T10:41:27.325736Z',
          updated_at: '2022-02-23T10:41:27.325736Z',
          id: '6b0f8873-aee7-414c-b661-7001f6e81961',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T10:41:23.773270Z',
          updated_at: '2022-02-23T10:41:23.773270Z',
          id: '04663f0e-2cf1-48f1-890d-3eac315b106c',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T10:40:45.586509Z',
          updated_at: '2022-02-23T10:40:45.586509Z',
          id: 'd2f352bb-f710-42c1-871a-2690be3bff52',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-23T10:40:35.175232Z',
          updated_at: '2022-02-23T10:40:35.175232Z',
          id: '7fd1c709-6d10-408b-b9a1-b46f0ca9aeb1',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'ad268900-9385-11ec-8080-80013035c5f7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '36a852cd-6f84-4e4c-b411-d4ec48f5b41f',
      collection: 'post',
      foreign_id: 'post:36a852cd-6f84-4e4c-b411-d4ec48f5b41f',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'Comment with image',
      },
      created_at: '2022-02-22T02:17:07.342611Z',
      updated_at: '2022-02-22T02:18:08.11113Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 12,
      comment_count: 13,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-22T02:18:08.656000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'c5a91587-b5c0-459f-9eef-c503954f2a6c',
    id: 'efe9c800-92be-11ec-8080-800124087730',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-22T08:23:02.338820Z',
          updated_at: '2022-02-22T08:23:02.338820Z',
          id: 'de9eb75c-d2ae-428d-ae00-7fcf0badb3a1',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {
            content: '10',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-22T08:23:00.465396Z',
          updated_at: '2022-02-22T08:23:00.465396Z',
          id: '1963786d-b714-4fc1-b2a1-fada04be87a7',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {
            content: '9',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-22T08:22:59.671081Z',
          updated_at: '2022-02-22T08:22:59.671081Z',
          id: 'cc668848-227e-4dcf-87e4-7ea87d858aaa',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {
            content: '8',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-22T08:22:57.336367Z',
          updated_at: '2022-02-22T08:22:57.336367Z',
          id: 'e128cde8-71ce-4682-abd1-f880ea15582d',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {
            content: '6',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T02:35:37.453515Z',
          updated_at: '2022-02-21T02:35:37.453515Z',
          id: 'd6f61c9e-8661-430e-9f5a-fc251055ddc0',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {
            content: '5',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-22T08:23:02.378264Z',
          updated_at: '2022-02-22T08:23:02.378264Z',
          id: '00f3f023-3fce-49ac-8811-fa95723a1f87',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-22T08:23:00.507506Z',
          updated_at: '2022-02-22T08:23:00.507506Z',
          id: 'ad62f4d1-a6ad-4e61-8bb4-a01fe47f4214',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-22T08:22:59.706646Z',
          updated_at: '2022-02-22T08:22:59.706646Z',
          id: '17c694d4-a427-454f-a389-41939e584084',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-22T08:22:57.372284Z',
          updated_at: '2022-02-22T08:22:57.372284Z',
          id: 'ecb8bd28-ac0e-46cc-bcb5-7d5601f1c959',
          user_id: '12',
          user: {
            created_at: '2022-01-10T10:03:39.466126Z',
            updated_at: '2022-03-11T07:04:59.118656Z',
            id: '12',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/5e4c83ce-0520-449d-9264-5370dc212206.png',
              fullname: 'Diem Trang',
            },
          },
          kind: 'comment_count',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T02:35:50.698084Z',
          updated_at: '2022-02-21T02:35:50.698084Z',
          id: '273e1ade-80e2-4d90-aed6-fe2f3cf03af3',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
      grinning_face_with_star_eyes: [
        {
          id: '4f15edd3-3f7f-43a2-a55b-2725d50d24a9',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'grinning_face_with_star_eyes',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T04:24:37.809894Z',
          updated_at: '2022-02-21T04:24:37.809894Z',
        },
        {
          id: 'dc174c3e-ff68-48ea-80d0-43ef549f8bef',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'grinning_face_with_star_eyes',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T02:35:46.852048Z',
          updated_at: '2022-02-21T02:35:46.852048Z',
        },
      ],
      kissing_closed_eyes: [
        {
          id: 'c2fd1c04-2867-4b68-a05a-15d8bdd9f8db',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'kissing_closed_eyes',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T04:24:36.505240Z',
          updated_at: '2022-02-21T04:24:36.505240Z',
        },
        {
          id: '20037d75-7176-42d3-9ee8-1c8990b24646',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'kissing_closed_eyes',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T02:35:43.340843Z',
          updated_at: '2022-02-21T02:35:43.340843Z',
        },
      ],
      kissing_smiling_eyes: [
        {
          id: '80e6372b-d64f-4a86-a77e-547e4ce18eec',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'kissing_smiling_eyes',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T04:24:38.865725Z',
          updated_at: '2022-02-21T04:24:38.865725Z',
        },
        {
          id: 'f83e1f31-d8e2-4760-ba57-b2d4ec255cab',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'kissing_smiling_eyes',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T02:35:57.124828Z',
          updated_at: '2022-02-21T02:35:57.124828Z',
        },
      ],
      sweat_smile: [
        {
          id: '1326894f-3417-4acc-bf04-6a08bc66c00b',
          user_id: '58',
          user: {
            id: '58',
            data: {
              fullname: 'Nguyen Thi Thu Quyền',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
            },
            created_at: '2022-01-24T08:35:18.713097Z',
            updated_at: '2022-03-14T08:19:30.365426Z',
          },
          kind: 'sweat_smile',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-25T10:16:40.677491Z',
          updated_at: '2022-02-25T10:16:40.677491Z',
        },
        {
          id: '496880fa-86f2-4707-92ba-31c9ffc29530',
          user_id: '33',
          user: {
            id: '33',
            data: {
              fullname: 'Nguyễn Thị Ngọc Linh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/a0f2b4bb-abf7-423d-9fed-0b706751b323.jpg',
            },
            created_at: '2022-01-11T02:46:10.540203Z',
            updated_at: '2022-03-14T10:59:10.736036Z',
          },
          kind: 'sweat_smile',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T04:24:39.910089Z',
          updated_at: '2022-02-21T04:24:39.910089Z',
        },
        {
          id: '1811e0d4-4d20-413c-a0ed-0c60b48a10d5',
          user_id: '2',
          user: {
            id: '2',
            data: {
              fullname: 'Trần Nam Anh',
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
            },
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
          },
          kind: 'sweat_smile',
          parent: '',
          activity_id: 'efe9c800-92be-11ec-8080-800124087730',
          created_at: '2022-02-21T02:45:15.397671Z',
          updated_at: '2022-02-21T02:45:15.397671Z',
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '541dd07d-5c26-489b-931a-5ac36b2d1aa4',
      collection: 'post',
      foreign_id: 'post:541dd07d-5c26-489b-931a-5ac36b2d1aa4',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'new post',
      },
      created_at: '2022-02-21T02:35:29.885223Z',
      updated_at: '2022-02-21T02:35:30.271191Z',
    },
    origin: null,
    own_reactions: {
      comment: [],
    },
    reaction_counts: {
      comment: 9,
      comment_count: 9,
      grinning_face_with_star_eyes: 2,
      kissing_closed_eyes: 2,
      kissing_smiling_eyes: 2,
      sweat_smile: 3,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-21T02:35:30.816000',
    type: 'post',
    verb: 'post',
    reactions_order: [
      'kissing_closed_eyes',
      'grinning_face_with_star_eyes',
      'kissing_smiling_eyes',
      'sweat_smile',
    ],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: '16e0be14-19c5-4647-be51-554ab250574d',
    id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-18T07:37:53.327008Z',
          updated_at: '2022-02-18T07:37:53.327008Z',
          id: '85c05927-3e4d-4670-a088-6eec3f2791e3',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {
            content: '4333',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-18T07:37:49.263375Z',
          updated_at: '2022-02-18T07:37:49.263375Z',
          id: '9d0af8fe-71ba-4fc8-8a60-73fbf96f95b6',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {
            content: 'hi',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-17T07:17:33.619524Z',
          updated_at: '2022-02-17T07:17:33.619524Z',
          id: '78538b79-f3c3-496e-bd10-1e6a5fb72452',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {
            content: '5',
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-17T07:17:32.974049Z',
          updated_at: '2022-02-17T07:17:32.974049Z',
          id: '8a3be95b-b302-4471-981f-27205bf663d7',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {
            content: '3',
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {
            satisfied: [
              {
                id: '030585e7-7981-4284-a913-e6d4510a76c6',
                user_id: '2',
                user: {
                  id: '2',
                  data: {
                    fullname: 'Trần Nam Anh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
                  },
                  created_at: '2022-01-10T03:45:06.563478Z',
                  updated_at: '2022-02-28T07:49:26.224174Z',
                },
                kind: 'satisfied',
                parent: '8a3be95b-b302-4471-981f-27205bf663d7',
                activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
                created_at: '2022-02-18T11:10:41.184686Z',
                updated_at: '2022-02-18T11:10:41.184686Z',
              },
            ],
            sweat_smile: [
              {
                id: '420068b1-77d3-435f-9b15-7a5da5aab5c0',
                user_id: '2',
                user: {
                  id: '2',
                  data: {
                    fullname: 'Trần Nam Anh',
                    avatar:
                      'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
                  },
                  created_at: '2022-01-10T03:45:06.563478Z',
                  updated_at: '2022-02-28T07:49:26.224174Z',
                },
                kind: 'sweat_smile',
                parent: '8a3be95b-b302-4471-981f-27205bf663d7',
                activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
                created_at: '2022-02-18T11:10:40.145761Z',
                updated_at: '2022-02-18T11:10:40.145761Z',
              },
            ],
          },
          children_counts: {
            satisfied: 1,
            sweat_smile: 1,
            comment_count: 0,
          },
          own_children: {
            satisfied: [],
            sweat_smile: [],
          },
        },
        {
          created_at: '2022-02-17T07:17:32.565512Z',
          updated_at: '2022-02-17T07:17:32.565512Z',
          id: 'd7e07123-be38-4755-9616-27cbfa6244f5',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {
            content: '2',
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          parent: '',
          latest_children: {},
          children_counts: {
            comment: 0,
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-18T09:20:02.232590Z',
          updated_at: '2022-02-18T09:20:02.232590Z',
          id: 'f6a43bec-9289-47bb-804e-48287b5b4314',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-18T09:19:58.216818Z',
          updated_at: '2022-02-18T09:19:58.216818Z',
          id: '86a70ed1-3c76-42e7-be0b-3303e6cb85fd',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-18T09:19:54.426507Z',
          updated_at: '2022-02-18T09:19:54.426507Z',
          id: '5380227a-5cb5-4e9b-8a65-78a38b70e3f0',
          user_id: '2',
          user: {
            created_at: '2022-01-10T03:45:06.563478Z',
            updated_at: '2022-02-28T07:49:26.224174Z',
            id: '2',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment_count',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-18T07:37:53.372107Z',
          updated_at: '2022-02-18T07:37:53.372107Z',
          id: 'd38fd55b-7142-4979-8ede-ac7f94b98439',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-18T07:37:49.319422Z',
          updated_at: '2022-02-18T07:37:49.319422Z',
          id: '3008f4e2-9b4e-4e7e-8e50-99d166a6d20c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: '86580091-f3b2-4c3c-bd2a-1284a17a1b5e',
      collection: 'post',
      foreign_id: 'post:86580091-f3b2-4c3c-bd2a-1284a17a1b5e',
      data: {
        images: [],
        videos: [],
        files: [],
        content: 'delete comment',
      },
      created_at: '2022-02-17T07:17:27.076695Z',
      updated_at: '2022-02-17T07:17:27.814295Z',
    },
    origin: null,
    own_reactions: {
      comment: [
        {
          created_at: '2022-02-18T07:37:53.327008Z',
          updated_at: '2022-02-18T07:37:53.327008Z',
          id: '85c05927-3e4d-4670-a088-6eec3f2791e3',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {
            content: '4333',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-18T07:37:49.263375Z',
          updated_at: '2022-02-18T07:37:49.263375Z',
          id: '9d0af8fe-71ba-4fc8-8a60-73fbf96f95b6',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {
            content: 'hi',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-18T07:37:53.372107Z',
          updated_at: '2022-02-18T07:37:53.372107Z',
          id: 'd38fd55b-7142-4979-8ede-ac7f94b98439',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-18T07:37:49.319422Z',
          updated_at: '2022-02-18T07:37:49.319422Z',
          id: '3008f4e2-9b4e-4e7e-8e50-99d166a6d20c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'a9daed80-8fc1-11ec-8080-800124a908a7',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    reaction_counts: {
      blush: 0,
      comment: 5,
      comment_count: 5,
      grin: 0,
      grinning: 0,
      joy: 0,
      kissing_closed_eyes: 0,
      kissing_heart: 0,
      nauseated_face: 0,
      rolling_on_the_floor_laughing: 0,
      satisfied: 0,
      slightly_smiling_face: 0,
      smile: 0,
      smiley: 0,
      smiling_face_with_smiling_eyes_and_hand_covering_mouth: 0,
      stuck_out_tongue: 0,
      stuck_out_tongue_closed_eyes: 0,
      stuck_out_tongue_winking_eye: 0,
      sweat_smile: 0,
      upside_down_face: 0,
      wink: 0,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-17T07:17:28.280000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
  {
    actor: {
      created_at: '2022-01-10T03:45:06.563478Z',
      updated_at: '2022-02-28T07:49:26.224174Z',
      id: '2',
      data: {
        avatar:
          'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9c0eafb0-678f-4f35-8969-3a0737ce85be.jpg',
        fullname: 'Trần Nam Anh',
      },
    },
    audience: {
      groups: [
        {
          id: '1',
          collection: 'groups',
          foreign_id: 'groups:1',
          data: {
            icon: '',
            name: 'EVOL Community',
          },
          created_at: '2022-01-10T10:04:48.724936Z',
          updated_at: '2022-01-10T10:04:48.724936Z',
        },
      ],
      users: [],
    },
    foreign_id: 'b311f22d-52e4-4b8d-8656-5fc352d66af6',
    id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
    important: {
      active: false,
      expires_time: '',
    },
    is_draft: false,
    latest_reactions: {
      comment: [
        {
          created_at: '2022-02-21T04:01:07.705431Z',
          updated_at: '2022-02-21T04:01:07.705431Z',
          id: '073a1506-faa0-41b3-85fb-ccc7e9f1362c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:06.437064Z',
          updated_at: '2022-02-21T04:01:06.437064Z',
          id: '60740b8a-31bd-4c0c-9336-b875d4ec5b79',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '9',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:03.012811Z',
          updated_at: '2022-02-21T04:01:03.012811Z',
          id: '2ab5f644-e72e-4e76-b17c-406a61f9817d',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '8',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:01.947336Z',
          updated_at: '2022-02-21T04:01:01.947336Z',
          id: 'cb29140b-3155-4a46-b1d1-72ced8d69b65',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '7',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:00.920713Z',
          updated_at: '2022-02-21T04:01:00.920713Z',
          id: '5b9cbc62-0fd7-40f7-91e7-a4ced5c519eb',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '6',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-21T04:01:07.736332Z',
          updated_at: '2022-02-21T04:01:07.736332Z',
          id: 'c35df30c-45e3-4e56-8777-9aef1e29676a',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:06.498100Z',
          updated_at: '2022-02-21T04:01:06.498100Z',
          id: '56e57a44-7afe-40bc-90cc-bfdea704580c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:03.045536Z',
          updated_at: '2022-02-21T04:01:03.045536Z',
          id: '47b0d05c-a8d7-41ec-af9c-b0c03798bdee',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:01.979352Z',
          updated_at: '2022-02-21T04:01:01.979352Z',
          id: '8355822b-535d-4b52-b533-fce3dfed2a86',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:00.952707Z',
          updated_at: '2022-02-21T04:01:00.952707Z',
          id: 'c7566a84-1687-4017-94df-99b761bb65ff',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    latest_reactions_extra: {
      comment_count: {
        next: '?limit=5',
      },
    },
    mentions: {
      users: {},
      groups: {},
    },
    object: {
      id: 'd1dfd6b5-e314-468a-aaa6-5382e9fa8292',
      collection: 'post',
      foreign_id: 'post:d1dfd6b5-e314-468a-aaa6-5382e9fa8292',
      data: {
        images: [],
        videos: [],
        files: [],
        content: ':)',
      },
      created_at: '2022-02-16T12:05:22.570793Z',
      updated_at: '2022-02-16T12:05:25.695884Z',
    },
    origin: null,
    own_reactions: {
      comment: [
        {
          created_at: '2022-02-21T04:01:07.705431Z',
          updated_at: '2022-02-21T04:01:07.705431Z',
          id: '073a1506-faa0-41b3-85fb-ccc7e9f1362c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '1',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:06.437064Z',
          updated_at: '2022-02-21T04:01:06.437064Z',
          id: '60740b8a-31bd-4c0c-9336-b875d4ec5b79',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '9',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:03.012811Z',
          updated_at: '2022-02-21T04:01:03.012811Z',
          id: '2ab5f644-e72e-4e76-b17c-406a61f9817d',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '8',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:01.947336Z',
          updated_at: '2022-02-21T04:01:01.947336Z',
          id: 'cb29140b-3155-4a46-b1d1-72ced8d69b65',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '7',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
        {
          created_at: '2022-02-21T04:01:00.920713Z',
          updated_at: '2022-02-21T04:01:00.920713Z',
          id: '5b9cbc62-0fd7-40f7-91e7-a4ced5c519eb',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {
            content: '6',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-2'],
          parent: '',
          latest_children: {},
          children_counts: {
            comment_count: 0,
          },
          own_children: {},
        },
      ],
      comment_count: [
        {
          created_at: '2022-02-21T04:01:07.736332Z',
          updated_at: '2022-02-21T04:01:07.736332Z',
          id: 'c35df30c-45e3-4e56-8777-9aef1e29676a',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:06.498100Z',
          updated_at: '2022-02-21T04:01:06.498100Z',
          id: '56e57a44-7afe-40bc-90cc-bfdea704580c',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:03.045536Z',
          updated_at: '2022-02-21T04:01:03.045536Z',
          id: '47b0d05c-a8d7-41ec-af9c-b0c03798bdee',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:01.979352Z',
          updated_at: '2022-02-21T04:01:01.979352Z',
          id: '8355822b-535d-4b52-b533-fce3dfed2a86',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
        {
          created_at: '2022-02-21T04:01:00.952707Z',
          updated_at: '2022-02-21T04:01:00.952707Z',
          id: 'c7566a84-1687-4017-94df-99b761bb65ff',
          user_id: '3',
          user: {
            created_at: '2022-01-10T03:50:58.527007Z',
            updated_at: '2022-02-11T09:08:10.989228Z',
            id: '3',
            data: {
              avatar:
                'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/26657b00-f704-47e6-9254-9e51d2365ac4.jpg',
              fullname: 'Huỳnh Phương Khanh',
            },
          },
          kind: 'comment_count',
          activity_id: 'b9da9c40-8f20-11ec-8080-80013952ac9a',
          data: {},
          parent: '',
          latest_children: {},
          children_counts: {},
        },
      ],
    },
    reaction_counts: {
      comment: 27,
      comment_count: 27,
      horse: 0,
      satisfied: 0,
      smiling_face_with_3_hearts: 0,
    },
    settings: {
      can_comment: true,
      can_react: true,
      can_share: true,
    },
    target: '',
    time: '2022-02-16T12:05:26.148000',
    type: 'post',
    verb: 'post',
    reactions_order: [],
  },
];
/**
 * Mock data of tree
 *  - EVOL Community
 *  - - Bein Community
 *  - - - Bein Product Team
 */
export const GROUP_TREE = {
  id: 1,
  parent_id: null,
  name: 'EVOL Community',
  slug: 'evol-community-1641809088',
  description: 'The greatest community ever',
  level: 0,
  parents: null,
  owner_id: 1,
  icon: '',
  background_img_url: null,
  group_type: 'COMPANY',
  privacy: 'PUBLIC',
  chat_id: 'rpq3unai7i8ztprmoz97rdjr7w',
  created_at: '2022-01-10T10:04:48.685Z',
  updated_at: '2022-01-10T10:04:48.928Z',
  deleted_at: null,
  children: [
    {
      id: 10,
      parent_id: 1,
      name: 'Bein Community',
      slug: '863b7fce-2a88-4441-aa24-4803f7b6d1ec-1641834908',
      description: null,
      level: 1,
      parents: [1],
      owner_id: 1,
      icon: null,
      background_img_url: null,
      group_type: 'GENERIC',
      privacy: 'PUBLIC',
      chat_id: 'nc1m1i78fpdaiktp7bdzdnntgh',
      created_at: '2022-01-10T17:15:08.123Z',
      updated_at: '2022-01-10T17:15:08.592Z',
      deleted_at: null,
      children: [
        {
          id: 17,
          parent_id: 10,
          name: 'Bein Product Team',
          slug: 'cd99ab19-a7bf-461b-9b0e-35f809774821-1641835298',
          description: null,
          level: 2,
          parents: [1, 10],
          owner_id: 1,
          icon: null,
          background_img_url: null,
          group_type: 'GENERIC',
          privacy: 'PUBLIC',
          chat_id: '3typp5m3b3r7byuu5q3fjqmaaa',
          created_at: '2022-01-10T17:21:38.026Z',
          updated_at: '2022-01-10T17:47:03.538Z',
          deleted_at: null,
          children: [],
          user_count: '18',
        },
      ],
      user_count: '19',
    },
  ],
  user_count: '25',
  unique: 'ad26adcf-2827-42e2-9f3e-19ae2192b6d0',
};
