const groupDataMocks = {
  getGroupBeIn: {
    code: 200,
    data: [
      {
        id: 1,
        parent_id: null,
        name: 'EVOL Community',
        slug: 'evol-community',
        description: 'The greatest community ever',
        level: 0,
        parents: [],
        owner_id: 1,
        icon: 'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
        created_at: '2021-07-28T17:17:25.034Z',
        updated_at: '2021-07-28T17:17:25.036Z',
        deleted_at: null,
        children: [
          {
            id: 2,
            parent_id: 1,
            name: 'Crypto Inner Circle',
            slug: 'cic',
            description: '',
            level: 1,
            parents: [1],
            owner_id: 1,
            icon: 'https://cdn.dribbble.com/users/183984/screenshots/2565088/pokemon_2.jpg',
            created_at: '2021-07-28T17:17:25.034Z',
            updated_at: '2021-07-28T17:17:25.036Z',
            deleted_at: null,
            children: [
              {
                id: 3,
                parent_id: 2,
                name: 'CIC - Newbie',
                slug: 'cic-newbie',
                description: '',
                level: 2,
                parents: [1, 2],
                owner_id: 1,
                icon: 'https://cdn.dribbble.com/users/183984/screenshots/2569843/pokemon_3.jpg',
                created_at: '2021-07-28T17:17:25.035Z',
                updated_at: '2021-07-28T17:17:25.036Z',
                deleted_at: null,
                children: [],
                userCount: 10,
              },
            ],
            userCount: 5,
          },
        ],
        userCount: 6,
      },
    ],
    meta: {
      message: 'Get group tree which the user being in successful',
    },
  },
  getGroupMembers: {
    code: 200,
    data: {
      admin: {
        id: 1,
        user_count: 5,
        name: 'Admin',
        data: [
          {
            id: 15,
            fullname: 'Trang Trang',
            avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
            title: 'Admin blah blah',
          },
        ],
      },
      member: {
        id: 1,
        user_count: 99999,
        name: 'Members',
        data: [
          {
            id: 9,
            fullname: 'Nam Anh',
            avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
            title: '', //optional
          },
          {
            id: 13,
            fullname: 'Ốc Hu Mần',
            avatarUrl: 'https://i.ibb.co/DW2bMGR/pikachu.jpg',
          },
        ],
      },
    },
  },
};

export default groupDataMocks;
