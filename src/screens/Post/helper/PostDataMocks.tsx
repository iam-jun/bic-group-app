const postDataMocks = {
  postCreateNewPost: {
    code: 200,
    data: {
      actor: '0',
      audience: {
        groups: [0],
        users: [0],
      },
      data: {
        content: '...',
      },
      foreign_id: '81dc89c0-d09d-4451-ab47-206485967c8c',
      id: '88997ca2-eeab-11eb-b029-128a130028af',
      latest_reactions: {
        comment: [
          {
            created_at: '2021-07-28T05:02:28.157651Z',
            updated_at: '2021-07-28T05:02:28.157651Z',
            id: '7bf850cf-179e-451b-86b3-fabaa0907966',
            user_id: '0',
            kind: 'comment',
            activity_id: '88997ca2-eeab-11eb-b029-128a130028af',
            data: {
              content: 'Second comment',
            },
            parent: '',
            latest_children: {},
            children_counts: {},
          },
          {
            created_at: '2021-07-28T02:52:39.272422Z',
            updated_at: '2021-07-28T02:52:39.272422Z',
            id: 'e10904f9-3200-48d0-b54f-cd5c669adbe2',
            user_id: '0',
            kind: 'comment',
            activity_id: '88997ca2-eeab-11eb-b029-128a130028af',
            data: {
              content: 'a new comment',
              files: ['string'],
              images: ['string'],
              videos: ['string'],
            },
            parent: '',
            latest_children: {},
            children_counts: {},
          },
        ],
        like: [
          {
            created_at: '2021-07-28T04:12:49.762248Z',
            updated_at: '2021-07-28T04:12:49.762248Z',
            id: 'e1ca9d05-86b0-4521-99f4-e7858ca34c02',
            user_id: '0',
            kind: 'like',
            activity_id: '88997ca2-eeab-11eb-b029-128a130028af',
            data: {},
            parent: '',
            latest_children: {},
            children_counts: {},
          },
        ],
      },
      latest_reactions_extra: {
        comment: {
          next: '',
        },
        like: {
          next: '',
        },
      },
      object: '-',
      origin: null,
      reaction_counts: {
        comment: 2,
        like: 1,
      },
      target: '',
      time: '2021-07-27T07:23:26.351069',
      type: 'post',
      verb: 'create',
    },
  },
  getGroups: {
    code: 200,
    data: [
      {
        id: 0,
        name: 'Bein',
        userCount: 555555,
        icon: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
      },
      {
        id: 16,
        name: 'Bein Community',
        userCount: 66666,
        icon: 'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg?compress=1&resize=800x600',
      },
      {
        id: 167,
        name: 'Bein Community Child 1',
        userCount: 7777,
        icon: 'https://cdn.dribbble.com/users/81809/screenshots/3460827/vegeta.jpg',
      },
      {
        id: 1678,
        name: 'Bein Community Child of Child 1',
        userCount: 888,
        icon: 'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
      },
    ],
  },
  getUsers: {
    code: 200,
    data: [
      {
        id: 14,
        name: 'Super Vegito',
        avatar:
          'https://cdn.dribbble.com/users/81809/screenshots/3460820/supervegito.jpg',
      },
      {
        id: 16,
        name: 'Vegito Blue',
        avatar:
          'https://cdn.dribbble.com/users/81809/screenshots/3448762/vegitoblue.jpg',
      },
    ],
  },
};

export default postDataMocks;
