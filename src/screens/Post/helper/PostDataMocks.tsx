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
  getSearchAudiences: {
    code: 200,
    data: {
      groups: [
        {
          id: 1,
          name: 'EVOL Community',
          description: 'The greatest community ever',
          parent_id: null,
          parents: [],
          icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
          children: [
            {
              id: 6,
              name: 'Bein Community',
              description: '',
              parent_id: 1,
              parents: [1],
              icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
              children: [
                {
                  id: 7,
                  name: 'Bein Founding Community',
                  description: '',
                  parent_id: 6,
                  parents: [1, 6],
                  icon: 'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
                  children: [
                    {
                      id: 8,
                      name: 'Bein Founding Update',
                      description: '',
                      parent_id: 7,
                      parents: [1, 6, 7],
                      icon: 'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
                      children: [],
                      userCount: 0,
                    },
                  ],
                  userCount: 0,
                },
              ],
              userCount: 1,
            },
          ],
          userCount: 6,
        },
        {
          id: 1,
          name: 'EVOL Community',
          description: 'The greatest community ever',
          parent_id: null,
          parents: [],
          icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
          children: [
            {
              id: 6,
              name: 'Bein Community',
              description: '',
              parent_id: 1,
              parents: [1],
              icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
              children: [
                {
                  id: 7,
                  name: 'Bein Founding Community',
                  description: '',
                  parent_id: 6,
                  parents: [1, 6],
                  icon: 'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
                  children: [
                    {
                      id: 9,
                      name: 'Bein Founding Chat',
                      description: '',
                      parent_id: 7,
                      parents: [1, 6, 7],
                      icon: 'https://cdn.dribbble.com/users/183984/screenshots/2574264/pokemon_4.jpg',
                      children: [],
                      userCount: 0,
                    },
                  ],
                  userCount: 0,
                },
              ],
              userCount: 1,
            },
          ],
          userCount: 6,
        },
        {
          id: 1,
          name: 'EVOL Community',
          description: 'The greatest community ever',
          parent_id: null,
          parents: [],
          icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
          children: [
            {
              id: 6,
              name: 'Bein Community',
              description: '',
              parent_id: 1,
              parents: [1],
              icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
              children: [
                {
                  id: 10,
                  name: 'Bein Open Community',
                  description: '',
                  parent_id: 6,
                  parents: [1, 6],
                  icon: 'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
                  children: [
                    {
                      id: 11,
                      name: 'Bein Open Update',
                      description: '',
                      parent_id: 10,
                      parents: [1, 6, 10],
                      icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                      children: [],
                      userCount: 0,
                    },
                  ],
                  userCount: 0,
                },
              ],
              userCount: 1,
            },
          ],
          userCount: 6,
        },
        {
          id: 1,
          name: 'EVOL Community',
          description: 'The greatest community ever',
          parent_id: null,
          parents: [],
          icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
          children: [
            {
              id: 6,
              name: 'Bein Community',
              description: '',
              parent_id: 1,
              parents: [1],
              icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
              children: [
                {
                  id: 10,
                  name: 'Bein Open Community',
                  description: '',
                  parent_id: 6,
                  parents: [1, 6],
                  icon: 'https://cdn.dribbble.com/users/183984/screenshots/2582592/pokemon_5.jpg',
                  children: [
                    {
                      id: 12,
                      name: 'Bein Open Chat',
                      description: '',
                      parent_id: 10,
                      parents: [1, 6, 10],
                      icon: 'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
                      children: [],
                      userCount: 0,
                    },
                  ],
                  userCount: 0,
                },
              ],
              userCount: 1,
            },
          ],
          userCount: 6,
        },
      ],
      users: [
        {
          id: 1,
          username: 'khoatd',
          email: 'khoatd@evol.group',
          fullname: 'Trần Đăng Khoa',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
        },
        {
          id: 3,
          username: 'thanct',
          email: 'thanct@evol.group',
          fullname: 'Cao Trọng Thân',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460820/supervegito.jpg',
        },
        {
          id: 6,
          username: 'hoangle',
          email: 'hoangle@evol.group',
          fullname: 'Lê Hoàng',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3448762/vegitoblue.jpg',
        },
        {
          id: 7,
          username: 'khanhhp',
          email: 'khanhhp@evol.group',
          fullname: 'Huỳnh Phương Khanh',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
        },
        {
          id: 9,
          username: 'namanh',
          email: 'anhtn@evol.group',
          fullname: 'Trần Nam Anh',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3448762/vegitoblue.jpg',
        },
        {
          id: 10,
          username: 'thienna',
          email: 'thienna@evol.group',
          fullname: 'Nguyễn Anh Thiện',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460827/vegeta.jpg',
        },
        {
          id: 12,
          username: 'nhanlx',
          email: 'nhanlx@evol.group',
          fullname: 'Nhân Long Xuyên',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3448762/vegitoblue.jpg',
        },
        {
          id: 13,
          username: 'nhanvt',
          email: 'nhanvt@evol.group',
          fullname: 'Ốc Hu Mần',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
        },
        {
          id: 14,
          username: 'toannv',
          email: 'toannv@evol.group',
          fullname: 'Nguyễn Văn Toàn',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
        },
        {
          id: 15,
          username: 'trangha',
          email: 'trangha@evol.group',
          fullname: 'Hà Phạm Diễm Trang',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
        },
        {
          id: 16,
          username: 'anhnm',
          email: 'anhnm@evol.group',
          fullname: 'Nguyễn Minh Anh',
          avatar:
            'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
        },
      ],
    },
    meta: {
      message: 'Search groups successfull',
    },
  },
};

export default postDataMocks;
