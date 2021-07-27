const postDataMocks = {
  postCreateNewPost: {
    code: 200,
    data: {
      id: '3945267d-edb9-11eb-ae95-0a1200300037',
      getstream_id: '3945267d-edb9-11eb-ae95-0a1200300037',
      type: 'post',
      data: {
        content: 'Hello group 0',
        files: [],
        images: [],
        videos: [],
      },
      audience: {
        groups: [0],
        users: [0],
      },
      actor: '0',
      duration: '6.03ms',
      foreign_id: 'e88affcb-1abf-47bb-ba23-2ad27b35e109',
      object: '-',
      origin: null,
      target: '',
      time: '2021-07-26T02:28:55.049792',
      verb: 'create',
    },
  },
  getGroups: {
    code: 200,
    data: [
      {
        id: 14,
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
