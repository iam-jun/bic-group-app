export const dataResponseStructure = {
  results: [],
  next: '',
  duration: '12.82ms',
  unseen: 0,
  unread: 0,
};

export const dummyGetStreamNotifications = {
  results: [
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:56.704694Z',
            updated_at: '2021-08-03T04:22:56.704694Z',
            id: '19',
            data: {
              avatarUrl: 'https://placekitten.com/640/360',
              fullname: 'user 19',
            },
          },
          foreign_id: 'reaction:7767de47-c907-4167-9d64-f68e3d0bcd8a',
          id: '13421e50-f469-11eb-8080-800101998aae',
          notificationType: 9,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T14:42:49.677576Z',
            updated_at: '2021-08-03T14:42:49.677576Z',
            id: '7767de47-c907-4167-9d64-f68e3d0bcd8a',
            user_id: '19',
            user: {
              created_at: '2021-08-03T04:22:56.704694Z',
              updated_at: '2021-08-03T04:22:56.704694Z',
              id: '19',
              data: {
                avatarUrl: 'https://placekitten.com/640/360',
                fullname: 'user 19',
              },
            },
            kind: 'haha',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {},
            parent: '',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T14:42:49.677576',
          verb: 'haha',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T14:42:49.686919',
      group: '13421e50-f469-11eb-8080-800101998aae_2021-08-03',
      id: '13438b4e-f469-11eb-8080-800032794f43.13421e50-f469-11eb-8080-800101998aae_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T14:42:49.686919',
      verb: 'haha',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:55.578165Z',
            updated_at: '2021-08-03T04:22:55.578165Z',
            id: '18',
            data: {
              avatarUrl: 'https://placekitten.com/640/360',
              fullname: 'user 18',
            },
          },
          foreign_id: 'reaction:0882c461-9a8d-4257-bd87-66c3776b4236',
          id: '0d5c52b2-f469-11eb-8080-800102d3eb90',
          notificationType: 9,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T14:42:39.782981Z',
            updated_at: '2021-08-03T14:42:39.782981Z',
            id: '0882c461-9a8d-4257-bd87-66c3776b4236',
            user_id: '18',
            user: {
              created_at: '2021-08-03T04:22:55.578165Z',
              updated_at: '2021-08-03T04:22:55.578165Z',
              id: '18',
              data: {
                avatarUrl: 'https://placekitten.com/640/360',
                fullname: 'user 18',
              },
            },
            kind: 'love',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {},
            parent: '',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T14:42:39.782981',
          verb: 'love',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T14:42:39.794036',
      group: '0d5c52b2-f469-11eb-8080-800102d3eb90_2021-08-03',
      id: '0d5e028e-f469-11eb-8080-800015ae1a81.0d5c52b2-f469-11eb-8080-800102d3eb90_2021-08-03',
      is_read: false,
      is_seen: true,
      updated_at: '2021-08-03T14:42:39.794036',
      verb: 'love',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:56.704694Z',
            updated_at: '2021-08-03T04:22:56.704694Z',
            id: '19',
            data: {
              avatarUrl: 'https://placekitten.com/640/360',
              fullname: 'user 19',
            },
          },
          foreign_id: 'reaction:f58aa3cf-e129-4ef6-a66a-86bc6edb9553',
          id: 'fc3fb97e-f468-11eb-8080-80013a4dfd30',
          notificationType: 8,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T14:42:11.074291Z',
            updated_at: '2021-08-03T14:42:11.074291Z',
            id: 'f58aa3cf-e129-4ef6-a66a-86bc6edb9553',
            user_id: '19',
            user: {
              created_at: '2021-08-03T04:22:56.704694Z',
              updated_at: '2021-08-03T04:22:56.704694Z',
              id: '19',
              data: {
                avatarUrl: 'https://placekitten.com/640/360',
                fullname: 'user 19',
              },
            },
            kind: 'comment',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {
              content: 'tôi thích comment của bạn :V',
            },
            parent: 'ddfd9b1f-9b91-4e16-9468-73f6cd6f5d45',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T14:42:11.074291',
          verb: 'comment',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T14:42:11.084832',
      group: 'fc3fb97e-f468-11eb-8080-80013a4dfd30_2021-08-03',
      id: 'fc415547-f468-11eb-8080-80012bdf82f7.fc3fb97e-f468-11eb-8080-80013a4dfd30_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T14:42:11.084832',
      verb: 'comment',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:53.531693Z',
            updated_at: '2021-08-03T04:22:53.531693Z',
            id: '16',
            data: {
              avatarUrl:
                'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
              fullname: 'Nguyễn Minh Anh',
            },
          },
          foreign_id: 'reaction:e85349ba-025b-4378-9be8-18eae7b94616',
          id: 'cf6e9898-f468-11eb-8080-80011044496f',
          notificationType: 8,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T14:40:55.883996Z',
            updated_at: '2021-08-03T14:40:55.883996Z',
            id: 'e85349ba-025b-4378-9be8-18eae7b94616',
            user_id: '16',
            user: {
              created_at: '2021-08-03T04:22:53.531693Z',
              updated_at: '2021-08-03T04:22:53.531693Z',
              id: '16',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
                fullname: 'Nguyễn Minh Anh',
              },
            },
            kind: 'comment',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {
              content: 'một ngày mới tốt lành',
            },
            parent: 'ddfd9b1f-9b91-4e16-9468-73f6cd6f5d45',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T14:40:55.883996',
          verb: 'comment',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T14:40:55.894961',
      group: 'cf6e9898-f468-11eb-8080-80011044496f_2021-08-03',
      id: 'cf7044ed-f468-11eb-8080-80012c6f5ef1.cf6e9898-f468-11eb-8080-80011044496f_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T14:40:55.894961',
      verb: 'comment',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:53.531693Z',
            updated_at: '2021-08-03T04:22:53.531693Z',
            id: '16',
            data: {
              avatarUrl:
                'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
              fullname: 'Nguyễn Minh Anh',
            },
          },
          foreign_id: 'reaction:a2ba6591-2715-431f-8448-a01df7385717',
          id: 'b5f89fb2-f468-11eb-8080-8001190bee30',
          notificationType: 9,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T14:40:13.167813Z',
            updated_at: '2021-08-03T14:40:13.167813Z',
            id: 'a2ba6591-2715-431f-8448-a01df7385717',
            user_id: '16',
            user: {
              created_at: '2021-08-03T04:22:53.531693Z',
              updated_at: '2021-08-03T04:22:53.531693Z',
              id: '16',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460812/ultimategohan.jpg',
                fullname: 'Nguyễn Minh Anh',
              },
            },
            kind: 'like',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {},
            parent: '',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T14:40:13.167813',
          verb: 'like',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T14:40:13.180221',
      group: 'b5f89fb2-f468-11eb-8080-8001190bee30_2021-08-03',
      id: 'b5fa8469-f468-11eb-8080-80003c53b836.b5f89fb2-f468-11eb-8080-8001190bee30_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T14:40:13.180221',
      verb: 'like',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:52.387731Z',
            updated_at: '2021-08-03T04:22:52.387731Z',
            id: '15',
            data: {
              avatarUrl:
                'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
              fullname: 'Hà Phạm Diễm Trang',
            },
          },
          foreign_id: 'reaction:ba06f304-3afe-4337-8854-c69fda3e35b6',
          id: 'b0e17648-f468-11eb-8080-800004a14d75',
          notificationType: 9,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T14:40:04.627412Z',
            updated_at: '2021-08-03T14:40:04.627412Z',
            id: 'ba06f304-3afe-4337-8854-c69fda3e35b6',
            user_id: '15',
            user: {
              created_at: '2021-08-03T04:22:52.387731Z',
              updated_at: '2021-08-03T04:22:52.387731Z',
              id: '15',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'Hà Phạm Diễm Trang',
              },
            },
            kind: 'like',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {},
            parent: '',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T14:40:04.627412',
          verb: 'like',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T14:40:04.650888',
      group: 'b0e17648-f468-11eb-8080-800004a14d75_2021-08-03',
      id: 'b0e50b55-f468-11eb-8080-800042fb441b.b0e17648-f468-11eb-8080-800004a14d75_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T14:40:04.650888',
      verb: 'like',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:51.384638Z',
            updated_at: '2021-08-03T04:22:51.384638Z',
            id: '14',
            data: {
              avatarUrl:
                'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
              fullname: 'Nguyễn Văn Toàn',
            },
          },
          foreign_id: 'reaction:d93db589-ae19-44da-913b-f75644921988',
          id: '9c68f47e-f446-11eb-8080-80001f78d9f6',
          notificationType: 8,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T10:36:07.394419Z',
            updated_at: '2021-08-03T10:36:07.394419Z',
            id: 'd93db589-ae19-44da-913b-f75644921988',
            user_id: '14',
            user: {
              created_at: '2021-08-03T04:22:51.384638Z',
              updated_at: '2021-08-03T04:22:51.384638Z',
              id: '14',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'Nguyễn Văn Toàn',
              },
            },
            kind: 'comment',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {
              content: 'comment to comment!',
            },
            parent: 'ddfd9b1f-9b91-4e16-9468-73f6cd6f5d45',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T10:36:07.394419',
          verb: 'comment',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T10:36:07.402582',
      group: '9c68f47e-f446-11eb-8080-80001f78d9f6_2021-08-03',
      id: '9c6a335e-f446-11eb-8080-800126e4af4e.9c68f47e-f446-11eb-8080-80001f78d9f6_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T10:36:07.402582',
      verb: 'comment',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:51.384638Z',
            updated_at: '2021-08-03T04:22:51.384638Z',
            id: '14',
            data: {
              avatarUrl:
                'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
              fullname: 'Nguyễn Văn Toàn',
            },
          },
          foreign_id: 'reaction:40339aed-cef7-4c56-8007-e99f720f1b52',
          id: 'bd10ee54-f444-11eb-8080-80013ae76424',
          notificationType: 7,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T10:22:43.188898Z',
            updated_at: '2021-08-03T10:22:43.188898Z',
            id: '40339aed-cef7-4c56-8007-e99f720f1b52',
            user_id: '14',
            user: {
              created_at: '2021-08-03T04:22:51.384638Z',
              updated_at: '2021-08-03T04:22:51.384638Z',
              id: '14',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'Nguyễn Văn Toàn',
              },
            },
            kind: 'comment',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {
              content: 'hello user 0',
            },
            parent: '',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T10:22:43.188898',
          verb: 'comment',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T10:22:43.198734',
      group: 'comment_2021-08-03',
      id: 'bd126e8d-f444-11eb-8080-8000062012b1.comment_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T10:22:43.198734',
      verb: 'comment',
    },
    {
      activities: [
        {
          actor: {
            created_at: '2021-08-03T04:22:51.384638Z',
            updated_at: '2021-08-03T04:22:51.384638Z',
            id: '14',
            data: {
              avatarUrl:
                'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
              fullname: 'Nguyễn Văn Toàn',
            },
          },
          foreign_id: 'reaction:2a9153f6-0203-4cbc-a20e-299d3cc22120',
          id: '9fc78ace-f444-11eb-8080-8000315697a1',
          notificationType: 9,
          object: {
            actor: {
              created_at: '2021-08-03T04:22:36.200363Z',
              updated_at: '2021-08-03T04:22:36.200363Z',
              id: '0',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'user 0',
              },
            },
            audience: {
              groups: [
                {
                  id: '0',
                  collection: 'groups',
                  foreign_id: 'groups:0',
                  data: {
                    avatarUrl:
                      'https://cdn.dribbble.com/users/183984/screenshots/2562247/pokemon.jpg',
                    name: 'Bein Team',
                  },
                  created_at: '2021-08-03T04:22:35.70546Z',
                  updated_at: '2021-08-03T04:22:35.70546Z',
                },
              ],
              users: [],
            },
            data: {
              content: 'Đố các bạn biết mình là ai!',
            },
            foreign_id: '38f2ac14-e81f-44af-836c-43ea917568d3',
            id: '798634b3-f444-11eb-b09c-0639629ed316',
            object: '-',
            origin: null,
            target: '',
            time: '2021-08-03T10:20:49.872402',
            type: 'post',
            verb: 'create',
          },
          origin: null,
          reaction: {
            created_at: '2021-08-03T10:21:54.054011Z',
            updated_at: '2021-08-03T10:21:54.054011Z',
            id: '2a9153f6-0203-4cbc-a20e-299d3cc22120',
            user_id: '14',
            user: {
              created_at: '2021-08-03T04:22:51.384638Z',
              updated_at: '2021-08-03T04:22:51.384638Z',
              id: '14',
              data: {
                avatarUrl:
                  'https://cdn.dribbble.com/users/81809/screenshots/3460815/piccolo.jpg',
                fullname: 'Nguyễn Văn Toàn',
              },
            },
            kind: 'like',
            activity_id: '798634b3-f444-11eb-b09c-0639629ed316',
            data: {},
            parent: '',
            latest_children: {},
            children_counts: {},
          },
          target: '',
          time: '2021-08-03T10:21:54.054011',
          verb: 'like',
        },
      ],
      activity_count: 1,
      actor_count: 1,
      created_at: '2021-08-03T10:21:54.062444',
      group: 'like_2021-08-03',
      id: '9fc8d438-f444-11eb-8080-8001429c04cd.like_2021-08-03',
      is_read: false,
      is_seen: false,
      updated_at: '2021-08-03T10:21:54.062444',
      verb: 'like',
    },
  ],
  next: '',
  duration: '20.63ms',
  unseen: 10,
  unread: 10,
};
