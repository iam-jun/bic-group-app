const postDataMocks = {
  postCreateNewPost: {
    code: 200,
    data: {
      id: '0437319f-efcd-11eb-87c6-1254437355c5',
      actor: {
        created_at: '2021-07-28T09:30:00.735602Z',
        updated_at: '2021-07-28T09:30:00.735602Z',
        id: '9',
        data: {
          avatarUrl: 'https://placekitten.com/640/360',
          fullname: 'user 9',
        },
      },
      audience: {
        groups: [
          {
            id: '6',
            collection: 'groups',
            foreign_id: 'groups:6',
            data: {
              avatarUrl: 'https://placekitten.com/640/360',
              name: 'group 6',
            },
            created_at: '2021-07-28T09:29:58.335288Z',
            updated_at: '2021-07-28T09:29:58.335288Z',
          },
        ],
        users: [
          {
            created_at: '2021-07-28T09:29:56.022496Z',
            updated_at: '2021-07-28T09:29:56.022496Z',
            id: '2',
            data: {
              avatarUrl: 'https://placekitten.com/640/360',
              fullname: 'user 2',
            },
          },
        ],
      },
      getstream_id: '0437319f-efcd-11eb-87c6-1254437355c5',
      type: 'post',
      data: {
        content: 'New post',
        files: [],
        images: [],
        videos: [],
      },
      duration: '5.55ms',
      foreign_id: '86e18b2a-5364-48cc-a8e7-bc557177224a',
      object: '-',
      origin: null,
      target: '',
      time: '2021-07-28T17:55:38.299230',
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
