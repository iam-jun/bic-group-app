export const VERB = {
  POST: 'post',
  MENTION: 'mention',
};

export const COMMENT_TARGET = {
  POST: 'post',
  COMMENT: 'comment',
};

export const SAMPLE_ACTIVITIES = [
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:45.776555Z',
          updated_at: '2022-03-01T08:18:56.458626Z',
          id: '20',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
            fullname: 'Trần Nam Anh',
          },
        },
        foreign_id: 'reaction:3e6d6081-ab95-4b19-b6da-0a69b924eadd',
        id: 'cd0a5352-9acc-11ec-8080-800172fa0ca6',
        notification_type: 7,
        object: {
          actor: {
            created_at: '2022-01-14T04:58:36.697637Z',
            updated_at: '2022-02-08T08:23:25.158318Z',
            id: '4',
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
                id: '6',
                collection: 'groups',
                foreign_id: 'groups:6',
                data: {
                  icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                  name: 'EVOL Community',
                },
                created_at: '2022-01-14T07:42:18.184353Z',
                updated_at: '2022-01-14T07:42:18.184353Z',
              },
            ],
            users: [],
          },
          foreign_id: '678a72f5-7245-45d8-b908-5150099d9c57',
          id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          important: {
            active: 0,
            expires_time: '',
          },
          is_draft: false,
          mentions: {
            groups: [],
            users: [],
          },
          object: {
            id: '49bec54f-df7f-455e-a81f-fa5440eb7f26',
            collection: 'post',
            foreign_id: 'post:49bec54f-df7f-455e-a81f-fa5440eb7f26',
            data: {
              content: 'Test notification',
              files: [],
              images: [],
              videos: [],
            },
            created_at: '2022-03-03T07:51:38.493398Z',
            updated_at: '2022-03-03T07:51:50.715071Z',
          },
          origin: null,
          settings: {
            can_comment: true,
            can_react: true,
            can_share: true,
          },
          target: '',
          time: '2022-03-03T07:51:51.200000',
          type: 'post',
          verb: 'post',
        },
        origin: null,
        reaction: {
          created_at: '2022-03-03T08:34:54.565461Z',
          updated_at: '2022-03-03T08:34:54.565461Z',
          id: '3e6d6081-ab95-4b19-b6da-0a69b924eadd',
          user_id: '20',
          user: {
            created_at: '2022-01-14T04:58:45.776555Z',
            updated_at: '2022-03-01T08:18:56.458626Z',
            id: '20',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-4'],
          parent: '',
          latest_children: {},
          children_counts: {},
          mentions: {
            users: {},
            groups: {},
          },
        },
        target: '',
        time: '2022-03-03T08:34:54.565461',
        verb: 'comment',
        mentions: {
          users: {},
          groups: {},
        },
      },
      {
        actor: {
          created_at: '2022-01-14T04:58:45.776555Z',
          updated_at: '2022-03-01T08:18:56.458626Z',
          id: '20',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
            fullname: 'Trần Nam Anh',
          },
        },
        foreign_id: 'reaction:19f416e1-ef1c-46b3-9f53-215345fbca88',
        id: 'e361c20a-9ac9-11ec-8080-80014d2f0ccf',
        notification_type: 7,
        object: {
          actor: {
            created_at: '2022-01-14T04:58:36.697637Z',
            updated_at: '2022-02-08T08:23:25.158318Z',
            id: '4',
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
                id: '6',
                collection: 'groups',
                foreign_id: 'groups:6',
                data: {
                  icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                  name: 'EVOL Community',
                },
                created_at: '2022-01-14T07:42:18.184353Z',
                updated_at: '2022-01-14T07:42:18.184353Z',
              },
            ],
            users: [],
          },
          foreign_id: '678a72f5-7245-45d8-b908-5150099d9c57',
          id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          important: {
            active: 0,
            expires_time: '',
          },
          is_draft: false,
          mentions: {
            groups: [],
            users: [],
          },
          object: {
            id: '49bec54f-df7f-455e-a81f-fa5440eb7f26',
            collection: 'post',
            foreign_id: 'post:49bec54f-df7f-455e-a81f-fa5440eb7f26',
            data: {
              content: 'Test notification',
              files: [],
              images: [],
              videos: [],
            },
            created_at: '2022-03-03T07:51:38.493398Z',
            updated_at: '2022-03-03T07:51:50.715071Z',
          },
          origin: null,
          settings: {
            can_comment: true,
            can_react: true,
            can_share: true,
          },
          target: '',
          time: '2022-03-03T07:51:51.200000',
          type: 'post',
          verb: 'post',
        },
        origin: null,
        reaction: {
          created_at: '2022-03-03T08:14:03.558145Z',
          updated_at: '2022-03-03T08:14:03.558145Z',
          id: '19f416e1-ef1c-46b3-9f53-215345fbca88',
          user_id: '20',
          user: {
            created_at: '2022-01-14T04:58:45.776555Z',
            updated_at: '2022-03-01T08:18:56.458626Z',
            id: '20',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Trần Nam Anh',
            },
          },
          kind: 'comment',
          activity_id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          data: {
            content: '.',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-4'],
          parent: '',
          latest_children: {},
          children_counts: {},
          mentions: {
            users: {},
            groups: {},
          },
        },
        target: '',
        time: '2022-03-03T08:14:03.558145',
        verb: 'comment',
        mentions: {
          users: {},
          groups: {},
        },
      },
    ],
    activity_count: 2,
    actor_count: 1,
    created_at: '2022-03-03T08:14:03.569624',
    group: 'comment_SA:c93c0a00-9ac6-11ec-8080-80012e1237f4_7_2022-03-03-08',
    id: 'cd0b6ad1-9acc-11ec-8080-80006849de57.comment_SA:c93c0a00-9ac6-11ec-8080-80012e1237f4_7_2022-03-03-08',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-03T08:34:54.572616',
    verb: 'comment',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:38.026900Z',
          updated_at: '2022-02-08T08:23:25.608062Z',
          id: '6',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
            fullname: 'Hà Phạm Diễm Trang',
            username: 'diemtrang',
          },
        },
        foreign_id: 'reaction:62e51c07-419e-4f7a-8a14-c41e6a3a52bd',
        id: '035267ac-9ac7-11ec-8080-800132d22928',
        notification_type: 7,
        object: {
          actor: {
            created_at: '2022-01-14T04:58:36.697637Z',
            updated_at: '2022-02-08T08:23:25.158318Z',
            id: '4',
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
                id: '6',
                collection: 'groups',
                foreign_id: 'groups:6',
                data: {
                  icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                  name: 'EVOL Community',
                },
                created_at: '2022-01-14T07:42:18.184353Z',
                updated_at: '2022-01-14T07:42:18.184353Z',
              },
            ],
            users: [],
          },
          foreign_id: '678a72f5-7245-45d8-b908-5150099d9c57',
          id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          important: {
            active: 0,
            expires_time: '',
          },
          is_draft: false,
          mentions: {
            groups: [],
            users: [],
          },
          object: {
            id: '49bec54f-df7f-455e-a81f-fa5440eb7f26',
            collection: 'post',
            foreign_id: 'post:49bec54f-df7f-455e-a81f-fa5440eb7f26',
            data: {
              content: 'Test notification',
              files: [],
              images: [],
              videos: [],
            },
            created_at: '2022-03-03T07:51:38.493398Z',
            updated_at: '2022-03-03T07:51:50.715071Z',
          },
          origin: null,
          settings: {
            can_comment: true,
            can_react: true,
            can_share: true,
          },
          target: '',
          time: '2022-03-03T07:51:51.200000',
          type: 'post',
          verb: 'post',
        },
        origin: null,
        reaction: {
          created_at: '2022-03-03T07:53:28.654430Z',
          updated_at: '2022-03-03T07:53:28.654430Z',
          id: '62e51c07-419e-4f7a-8a14-c41e6a3a52bd',
          user_id: '6',
          user: {
            created_at: '2022-01-14T04:58:38.026900Z',
            updated_at: '2022-02-08T08:23:25.608062Z',
            id: '6',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Hà Phạm Diễm Trang',
              username: 'diemtrang',
            },
          },
          kind: 'comment',
          activity_id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          data: {
            content: '@khanhlinh',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [62],
            },
          },
          target_feeds: ['notification:u-4'],
          parent: '',
          latest_children: {},
          children_counts: {},
          mentions: {
            users: {
              khanhlinh: {
                id: '62',
                data: {
                  username: 'khanhlinh',
                  fullname: 'Nguyễn Thị Khánh Linh',
                  avatar:
                    'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
                },
              },
            },
            groups: {},
          },
        },
        target: '',
        time: '2022-03-03T07:53:28.654430',
        verb: 'comment',
        mentions: {
          users: {},
          groups: {},
        },
      },
      {
        actor: {
          created_at: '2022-01-14T04:58:40.454113Z',
          updated_at: '2022-02-28T06:37:36.532153Z',
          id: '11',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
            fullname: 'Ngọc Cường Cường Ngọc',
          },
        },
        foreign_id: 'reaction:1c7be334-b7ff-4664-8d77-abcd5eba1a03',
        id: 'dee7fe40-9ac6-11ec-8080-800058b9ae3c',
        notification_type: 7,
        object: {
          actor: {
            created_at: '2022-01-14T04:58:36.697637Z',
            updated_at: '2022-02-08T08:23:25.158318Z',
            id: '4',
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
                id: '6',
                collection: 'groups',
                foreign_id: 'groups:6',
                data: {
                  icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                  name: 'EVOL Community',
                },
                created_at: '2022-01-14T07:42:18.184353Z',
                updated_at: '2022-01-14T07:42:18.184353Z',
              },
            ],
            users: [],
          },
          foreign_id: '678a72f5-7245-45d8-b908-5150099d9c57',
          id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          important: {
            active: 0,
            expires_time: '',
          },
          is_draft: false,
          mentions: {
            groups: [],
            users: [],
          },
          object: {
            id: '49bec54f-df7f-455e-a81f-fa5440eb7f26',
            collection: 'post',
            foreign_id: 'post:49bec54f-df7f-455e-a81f-fa5440eb7f26',
            data: {
              content: 'Test notification',
              files: [],
              images: [],
              videos: [],
            },
            created_at: '2022-03-03T07:51:38.493398Z',
            updated_at: '2022-03-03T07:51:50.715071Z',
          },
          origin: null,
          settings: {
            can_comment: true,
            can_react: true,
            can_share: true,
          },
          target: '',
          time: '2022-03-03T07:51:51.200000',
          type: 'post',
          verb: 'post',
        },
        origin: null,
        reaction: {
          created_at: '2022-03-03T07:52:27.559072Z',
          updated_at: '2022-03-03T07:52:27.559072Z',
          id: '1c7be334-b7ff-4664-8d77-abcd5eba1a03',
          user_id: '11',
          user: {
            created_at: '2022-01-14T04:58:40.454113Z',
            updated_at: '2022-02-28T06:37:36.532153Z',
            id: '11',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Ngọc Cường Cường Ngọc',
            },
          },
          kind: 'comment',
          activity_id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          data: {
            content: '>quote',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-4'],
          parent: '',
          latest_children: {},
          children_counts: {},
          mentions: {
            users: {},
            groups: {},
          },
        },
        target: '',
        time: '2022-03-03T07:52:27.559072',
        verb: 'comment',
        mentions: {
          users: {},
          groups: {},
        },
      },
      {
        actor: {
          created_at: '2022-01-14T04:58:40.454113Z',
          updated_at: '2022-02-28T06:37:36.532153Z',
          id: '11',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
            fullname: 'Ngọc Cường Cường Ngọc',
          },
        },
        foreign_id: 'reaction:b5a2e5cd-597e-4c37-8ef7-f346b4467b92',
        id: 'dbc36d3a-9ac6-11ec-8080-80006a764ab5',
        notification_type: 7,
        object: {
          actor: {
            created_at: '2022-01-14T04:58:36.697637Z',
            updated_at: '2022-02-08T08:23:25.158318Z',
            id: '4',
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
                id: '6',
                collection: 'groups',
                foreign_id: 'groups:6',
                data: {
                  icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                  name: 'EVOL Community',
                },
                created_at: '2022-01-14T07:42:18.184353Z',
                updated_at: '2022-01-14T07:42:18.184353Z',
              },
            ],
            users: [],
          },
          foreign_id: '678a72f5-7245-45d8-b908-5150099d9c57',
          id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          important: {
            active: 0,
            expires_time: '',
          },
          is_draft: false,
          mentions: {
            groups: [],
            users: [],
          },
          object: {
            id: '49bec54f-df7f-455e-a81f-fa5440eb7f26',
            collection: 'post',
            foreign_id: 'post:49bec54f-df7f-455e-a81f-fa5440eb7f26',
            data: {
              content: 'Test notification',
              files: [],
              images: [],
              videos: [],
            },
            created_at: '2022-03-03T07:51:38.493398Z',
            updated_at: '2022-03-03T07:51:50.715071Z',
          },
          origin: null,
          settings: {
            can_comment: true,
            can_react: true,
            can_share: true,
          },
          target: '',
          time: '2022-03-03T07:51:51.200000',
          type: 'post',
          verb: 'post',
        },
        origin: null,
        reaction: {
          created_at: '2022-03-03T07:52:22.286265Z',
          updated_at: '2022-03-03T07:52:22.286265Z',
          id: 'b5a2e5cd-597e-4c37-8ef7-f346b4467b92',
          user_id: '11',
          user: {
            created_at: '2022-01-14T04:58:40.454113Z',
            updated_at: '2022-02-28T06:37:36.532153Z',
            id: '11',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Ngọc Cường Cường Ngọc',
            },
          },
          kind: 'comment',
          activity_id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          data: {
            content: '__nghiêng__',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-4'],
          parent: '',
          latest_children: {},
          children_counts: {},
          mentions: {
            users: {},
            groups: {},
          },
        },
        target: '',
        time: '2022-03-03T07:52:22.286265',
        verb: 'comment',
        mentions: {
          users: {},
          groups: {},
        },
      },
      {
        actor: {
          created_at: '2022-01-14T04:58:40.454113Z',
          updated_at: '2022-02-28T06:37:36.532153Z',
          id: '11',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
            fullname: 'Ngọc Cường Cường Ngọc',
          },
        },
        foreign_id: 'reaction:42978aa4-24a9-48c5-80c6-bef50b3b689c',
        id: 'd4437fe6-9ac6-11ec-8080-80017b7a2859',
        notification_type: 7,
        object: {
          actor: {
            created_at: '2022-01-14T04:58:36.697637Z',
            updated_at: '2022-02-08T08:23:25.158318Z',
            id: '4',
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
                id: '6',
                collection: 'groups',
                foreign_id: 'groups:6',
                data: {
                  icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                  name: 'EVOL Community',
                },
                created_at: '2022-01-14T07:42:18.184353Z',
                updated_at: '2022-01-14T07:42:18.184353Z',
              },
            ],
            users: [],
          },
          foreign_id: '678a72f5-7245-45d8-b908-5150099d9c57',
          id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          important: {
            active: 0,
            expires_time: '',
          },
          is_draft: false,
          mentions: {
            groups: [],
            users: [],
          },
          object: {
            id: '49bec54f-df7f-455e-a81f-fa5440eb7f26',
            collection: 'post',
            foreign_id: 'post:49bec54f-df7f-455e-a81f-fa5440eb7f26',
            data: {
              content: 'Test notification',
              files: [],
              images: [],
              videos: [],
            },
            created_at: '2022-03-03T07:51:38.493398Z',
            updated_at: '2022-03-03T07:51:50.715071Z',
          },
          origin: null,
          settings: {
            can_comment: true,
            can_react: true,
            can_share: true,
          },
          target: '',
          time: '2022-03-03T07:51:51.200000',
          type: 'post',
          verb: 'post',
        },
        origin: null,
        reaction: {
          created_at: '2022-03-03T07:52:09.703831Z',
          updated_at: '2022-03-03T07:52:09.703831Z',
          id: '42978aa4-24a9-48c5-80c6-bef50b3b689c',
          user_id: '11',
          user: {
            created_at: '2022-01-14T04:58:40.454113Z',
            updated_at: '2022-02-28T06:37:36.532153Z',
            id: '11',
            data: {
              avatar:
                'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              fullname: 'Ngọc Cường Cường Ngọc',
            },
          },
          kind: 'comment',
          activity_id: 'c93c0a00-9ac6-11ec-8080-80012e1237f4',
          data: {
            content: '**bold**',
            edited: false,
            images: [],
            mentions: {
              groups: [],
              users: [],
            },
          },
          target_feeds: ['notification:u-4'],
          parent: '',
          latest_children: {},
          children_counts: {},
          mentions: {
            users: {},
            groups: {},
          },
        },
        target: '',
        time: '2022-03-03T07:52:09.703831',
        verb: 'comment',
        mentions: {
          users: {},
          groups: {},
        },
      },
    ],
    activity_count: 4,
    actor_count: 2,
    created_at: '2022-03-03T07:52:09.716920',
    group: 'comment_SA:c93c0a00-9ac6-11ec-8080-80012e1237f4_7_2022-03-03-07',
    id: '03548fe5-9ac7-11ec-8080-80002873e321.comment_SA:c93c0a00-9ac6-11ec-8080-80012e1237f4_7_2022-03-03-07',
    is_read: true,
    is_seen: true,
    updated_at: '2022-03-03T07:53:28.668566',
    verb: 'comment',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '7',
              collection: 'groups',
              foreign_id: 'groups:7',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Bein Community',
              },
              created_at: '2022-01-14T07:44:45.922123Z',
              updated_at: '2022-01-14T07:44:45.922123Z',
            },
            {
              id: '39',
              collection: 'groups',
              foreign_id: 'groups:39',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'T-ara',
              },
              created_at: '2022-01-18T09:38:40.35169Z',
              updated_at: '2022-01-18T09:38:40.35169Z',
            },
          ],
          users: [],
        },
        foreign_id: 'd6f0a1da-e948-4c2d-aeea-e65ca993e837',
        id: 'ca250a50-99dd-11ec-8080-8001794e5a0a',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: 'bdd527f8-aa7a-4e86-9eda-8fe2fb2c1456',
          collection: 'post',
          foreign_id: 'post:bdd527f8-aa7a-4e86-9eda-8fe2fb2c1456',
          data: {
            content: 'Split the Select Audience step separately 3',
            files: [],
            images: [
              {
                height: 1334,
                name: '8ac2fa05-dfe5-4178-9f32-d124baa251ae.jpg',
                origin_name: 'F4D322D1-929B-4CEE-B4C1-EB0E976D3E07.jpg',
                width: 750,
              },
            ],
            videos: [],
          },
          created_at: '2022-03-02T04:03:05.327496Z',
          updated_at: '2022-03-02T04:03:59.537158Z',
        },
        origin: 'timeline:g-7',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-02T04:03:59.989000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-02T04:04:00.004193',
    group: 'ca250a50-99dd-11ec-8080-8001794e5a0a',
    id: 'ca275bd0-99dd-11ec-8080-80015ca201a9.ca250a50-99dd-11ec-8080-8001794e5a0a',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-02T04:04:00.004193',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
          ],
          users: [],
        },
        foreign_id: '8025fd5a-b554-4d2a-817a-71c0922531d3',
        id: '6aa170f0-99dd-11ec-8080-80016176de1e',
        important: {
          active: 1,
          expires_time: '2022-03-03T05:00:38.271Z',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '6e046d3a-fc39-473b-963c-ae2af01d0290',
          collection: 'post',
          foreign_id: 'post:6e046d3a-fc39-473b-963c-ae2af01d0290',
          data: {
            content: 'Split the Select Audience step separately 2',
            files: [],
            images: [
              {
                height: 1600,
                name: 'd7e258aa-5265-4bcb-9973-72423f36e425.png',
                origin_name: 'Screenshot_20220301-155627.png',
                width: 720,
              },
            ],
            videos: [],
          },
          created_at: '2022-03-02T04:00:19.751638Z',
          updated_at: '2022-03-02T04:01:06.957086Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-02T04:01:19.743000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-02T04:01:19.758245',
    group: '6aa170f0-99dd-11ec-8080-80016176de1e',
    id: '6aa3c473-99dd-11ec-8080-80004bf83930.6aa170f0-99dd-11ec-8080-80016176de1e',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-02T04:01:19.758245',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:46.944221Z',
          updated_at: '2022-02-21T08:50:34.614386Z',
          id: '24',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9d7196de-1ef3-40c8-9fa7-8a1edb31c170.jpg',
            fullname: 'Nhân Võ Thành',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '7',
              collection: 'groups',
              foreign_id: 'groups:7',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Bein Community',
              },
              created_at: '2022-01-14T07:44:45.922123Z',
              updated_at: '2022-01-14T07:44:45.922123Z',
            },
            {
              id: '14',
              collection: 'groups',
              foreign_id: 'groups:14',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Bein Product Team',
              },
              created_at: '2022-01-14T08:03:30.875425Z',
              updated_at: '2022-01-14T08:03:30.875425Z',
            },
          ],
          users: [],
        },
        foreign_id: '94435b74-c383-44c1-bdd9-5bc9872719be',
        id: 'f5f71120-99db-11ec-8080-80003657b8a2',
        important: {
          active: 0,
          expires_time: null,
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: 'a2ce49aa-2530-4a6c-b08b-ae29f079bf11',
          collection: 'post',
          foreign_id: 'post:a2ce49aa-2530-4a6c-b08b-ae29f079bf11',
          data: {
            content: 'Damn bro',
            files: [],
            images: [
              {
                height: 1302,
                name: 'e52943a6-d2e1-4d5d-83de-75f2e6359a6f.png',
                origin_name: 'Screen Shot 2022-03-01 at 15.38.10.png',
                width: 130,
              },
            ],
            videos: [],
          },
          created_at: '2022-02-28T07:01:22.233335Z',
          updated_at: '2022-03-02T09:25:40.134448Z',
        },
        origin: 'timeline:g-14',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-02T03:50:54.514000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-02T03:50:54.528552',
    group: 'f5f71120-99db-11ec-8080-80003657b8a2',
    id: 'f5f94994-99db-11ec-8080-80012b60f3d5.f5f71120-99db-11ec-8080-80003657b8a2',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-02T03:50:54.528552',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '7',
              collection: 'groups',
              foreign_id: 'groups:7',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Bein Community',
              },
              created_at: '2022-01-14T07:44:45.922123Z',
              updated_at: '2022-01-14T07:44:45.922123Z',
            },
            {
              id: '30',
              collection: 'groups',
              foreign_id: 'groups:30',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Exo',
              },
              created_at: '2022-01-17T07:46:27.076707Z',
              updated_at: '2022-01-17T07:46:27.076707Z',
            },
            {
              id: '32',
              collection: 'groups',
              foreign_id: 'groups:32',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Lisa',
              },
              created_at: '2022-01-17T08:32:14.664599Z',
              updated_at: '2022-01-17T08:32:14.664599Z',
            },
          ],
          users: [],
        },
        foreign_id: 'b5dab3e0-205b-4a0f-9865-9378372103b9',
        id: '96ae36d0-99db-11ec-8080-8001368d338a',
        important: {
          active: 1,
          expires_time: '2022-03-02T04:47:54.052Z',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '09c25cfb-aa7d-461a-8d59-79e17cf9f8b2',
          collection: 'post',
          foreign_id: 'post:09c25cfb-aa7d-461a-8d59-79e17cf9f8b2',
          data: {
            content: 'Split the Select Audience step separately 1 - edited',
            files: [],
            images: [
              {
                height: 512,
                name: 'b734b0ab-74be-4ddf-a46f-5015ba148af9.png',
                origin_name: '71itmKw7o9L.png',
                width: 512,
              },
            ],
            videos: [],
          },
          created_at: '2022-03-02T03:47:26.23933Z',
          updated_at: '2022-03-02T03:48:34.094032Z',
        },
        origin: 'timeline:g-7',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-02T03:48:14.653000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-02T03:48:14.664924',
    group: '96ae36d0-99db-11ec-8080-8001368d338a',
    id: '96b00898-99db-11ec-8080-80002574b640.96ae36d0-99db-11ec-8080-8001368d338a',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-02T03:48:14.664924',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '7',
              collection: 'groups',
              foreign_id: 'groups:7',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Bein Community',
              },
              created_at: '2022-01-14T07:44:45.922123Z',
              updated_at: '2022-01-14T07:44:45.922123Z',
            },
            {
              id: '75',
              collection: 'groups',
              foreign_id: 'groups:75',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: '28022022-Test Remove group',
              },
              created_at: '2022-02-28T07:13:51.477126Z',
              updated_at: '2022-02-28T07:13:51.477126Z',
            },
          ],
          users: [],
        },
        foreign_id: 'f7e2b8e0-64d4-464a-8ca2-306f0fc8d8ff',
        id: '5240d1b0-99db-11ec-8080-80007167b7bb',
        important: {
          active: 1,
          expires_time: '2022-03-02T04:46:08.065Z',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '07d5951c-101d-42aa-b30a-2dd51b2ec9ad',
          collection: 'post',
          foreign_id: 'post:07d5951c-101d-42aa-b30a-2dd51b2ec9ad',
          data: {
            content: 'Split the Select Audience step separately',
            files: [],
            images: [],
            videos: [],
          },
          created_at: '2022-03-02T03:45:45.456123Z',
          updated_at: '2022-03-02T03:46:10.234903Z',
        },
        origin: 'timeline:g-7',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-02T03:46:19.851000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-02T03:46:19.863952',
    group: '5240d1b0-99db-11ec-8080-80007167b7bb',
    id: '5242cba8-99db-11ec-8080-80003795ab64.5240d1b0-99db-11ec-8080-80007167b7bb',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-02T03:46:19.863952',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:46.944221Z',
          updated_at: '2022-02-21T08:50:34.614386Z',
          id: '24',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/9d7196de-1ef3-40c8-9fa7-8a1edb31c170.jpg',
            fullname: 'Nhân Võ Thành',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
          ],
          users: [],
        },
        foreign_id: '50db56d9-c0b8-4ec1-a379-d2998ed6a77d',
        id: '35ac1b20-99d8-11ec-8080-80006ef71fc3',
        important: {
          active: 0,
          expires_time: null,
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '38fa99a7-0801-4d38-b768-33b69ac66d39',
          collection: 'post',
          foreign_id: 'post:38fa99a7-0801-4d38-b768-33b69ac66d39',
          data: {
            content:
              'viết xuống dòng.\n.\n.\n>\n.\n.\n>\n.\n>\n>\n>\n>\nThis is the line\n. \n.\n.\n>\n>\n.\n.\nThis is second line\n.\n.\n>\n.\n.\n>\n.\n.\nThis is third line\n.\n.\n\n<\n',
            files: [],
            images: [
              {
                height: 1244,
                name: '7e85be4f-a3cb-4e3a-9d18-07fb9cea338f.png',
                origin_name: 'Screen Shot 2022-03-01 at 10.32.31.png',
                width: 798,
              },
            ],
            videos: [],
          },
          created_at: '2022-03-02T03:23:43.863994Z',
          updated_at: '2022-03-02T03:25:22.878504Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-02T03:24:03.410000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-02T03:24:03.423065',
    group: '35ac1b20-99d8-11ec-8080-80006ef71fc3',
    id: '35ae197f-99d8-11ec-8080-800147622611.35ac1b20-99d8-11ec-8080-80006ef71fc3',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-02T03:24:03.423065',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
          ],
          users: [],
        },
        foreign_id: 'cd903ed4-10c7-4c0f-95a7-007f01308c77',
        id: '02b7d270-9944-11ec-8080-80014dcebf07',
        important: {
          active: 0,
          expires_time: null,
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '34d57e8a-8217-40a6-9a21-c47a7118435e',
          collection: 'post',
          foreign_id: 'post:34d57e8a-8217-40a6-9a21-c47a7118435e',
          data: {
            content:
              'Edited - Post dài vừa vừa \n\nHầu hết những người đang làm việc trong nước và ngoài nước chỉ có vài phần trăm là làm việc theo đam mê và nhiệt huyết. Còn lại chủ yếu làm việc chỉ để mưu sinh và kiếm tiền phục vụ cho cuộc sống. Điều này làm cho chữ “công việc” trở thành nỗi ám ảnh và mệt mỏi khi nhắc đến. Vậy làm sao để yêu công việc mình đang làm dù không phải chuyên môn? Làm sao để thúc đẩy một ngày làm việc năng động? Điều đó còn tùy thuộc vào việc hiểu mọi ngóc ngách của cuộc sống là gì?',
            files: [],
            images: [
              {
                height: 2133,
                name: '9929e95c-c398-4eb4-82b8-172174e0c884.jpg',
                origin_name: '8698d488d7a859a3df877da4d06ac21f.jpg',
                width: 1200,
              },
            ],
            videos: [],
          },
          created_at: '2022-03-01T09:42:53.151736Z',
          updated_at: '2022-03-01T09:49:24.493949Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-01T09:43:12.407000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-01T09:43:12.418365',
    group: '02b7d270-9944-11ec-8080-80014dcebf07',
    id: '02b98e6b-9944-11ec-8080-8000243bd2fd.02b7d270-9944-11ec-8080-80014dcebf07',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-01T09:43:12.418365',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
          ],
          users: [],
        },
        foreign_id: 'abeb8d2b-108b-4230-8519-2923f36d7980',
        id: 'e8e92fd0-9937-11ec-8080-800028575d46',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: 'b5c62ab0-0103-4c60-821f-041adefbf415',
          collection: 'post',
          foreign_id: 'post:b5c62ab0-0103-4c60-821f-041adefbf415',
          data: {
            content: 'Edit comment',
            files: [],
            images: [],
            videos: [],
          },
          created_at: '2022-03-01T08:16:30.541761Z',
          updated_at: '2022-03-01T08:16:34.619754Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-03-01T08:16:35.149000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-03-01T08:16:35.162318',
    group: 'e8e92fd0-9937-11ec-8080-800028575d46',
    id: 'e8eb380e-9937-11ec-8080-80010a461847.e8e92fd0-9937-11ec-8080-800028575d46',
    is_read: false,
    is_seen: true,
    updated_at: '2022-03-01T08:16:35.162318',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '26',
              collection: 'groups',
              foreign_id: 'groups:26',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'K_POP',
              },
              created_at: '2022-01-17T07:19:02.780325Z',
              updated_at: '2022-01-17T07:19:02.780325Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
          ],
          users: [],
        },
        foreign_id: '50542b58-fbc7-446e-aeab-dc446c7f7496',
        id: 'db9d9fe0-98ac-11ec-8080-8000790d1608',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {
            testsendmail: {
              id: '70',
              data: {
                username: 'testsendmail',
                fullname: 'mai test send mail',
                avatar:
                  'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              },
              created_at: '2022-02-21T09:03:25.777129Z',
              updated_at: '2022-02-21T09:03:25.777129Z',
            },
          },
          groups: {},
        },
        object: {
          id: '8da23ba4-95e1-4d28-a40e-4caeee0d7a59',
          collection: 'post',
          foreign_id: 'post:8da23ba4-95e1-4d28-a40e-4caeee0d7a59',
          data: {
            content: '@testsendmail Create post auto with group(s) as audience',
            files: [],
            images: [
              {
                height: 440,
                name: '25a1a76d-4625-4d19-9292-11a499d77052.jpg',
                origin_name: '1b5-660x440.jpg',
                width: 660,
              },
            ],
            videos: [],
          },
          created_at: '2022-02-28T15:41:00.127777Z',
          updated_at: '2022-02-28T15:41:12.361783Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T15:41:12.798000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T15:41:12.887716',
    group: 'db9d9fe0-98ac-11ec-8080-8000790d1608',
    id: 'dbab506a-98ac-11ec-8080-80007c72cbf1.db9d9fe0-98ac-11ec-8080-8000790d1608',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T15:41:12.887716',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '26',
              collection: 'groups',
              foreign_id: 'groups:26',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'K_POP',
              },
              created_at: '2022-01-17T07:19:02.780325Z',
              updated_at: '2022-01-17T07:19:02.780325Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
          ],
          users: [],
        },
        foreign_id: 'b8096b13-1199-48e1-9aae-f5a0b6171551',
        id: '76141ff0-98ac-11ec-8080-80005ef8394b',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {
            testsendmail: {
              id: '70',
              data: {
                username: 'testsendmail',
                fullname: 'mai test send mail',
                avatar:
                  'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              },
              created_at: '2022-02-21T09:03:25.777129Z',
              updated_at: '2022-02-21T09:03:25.777129Z',
            },
          },
          groups: {},
        },
        object: {
          id: '57dfaf24-639d-4724-b5bb-2f0ae81cbe78',
          collection: 'post',
          foreign_id: 'post:57dfaf24-639d-4724-b5bb-2f0ae81cbe78',
          data: {
            content: '@testsendmail Create post auto with group(s) as audience',
            files: [],
            images: [
              {
                height: 440,
                name: 'a7204be5-f9e5-4d56-a6ab-0e367024593d.jpg',
                origin_name: '1b5-660x440.jpg',
                width: 660,
              },
            ],
            videos: [],
          },
          created_at: '2022-02-28T15:38:09.475858Z',
          updated_at: '2022-02-28T15:38:22.110695Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T15:38:22.447000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T15:38:22.508745',
    group: '76141ff0-98ac-11ec-8080-80005ef8394b',
    id: '761d8bdf-98ac-11ec-8080-80015041283b.76141ff0-98ac-11ec-8080-80005ef8394b',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T15:38:22.508745',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '26',
              collection: 'groups',
              foreign_id: 'groups:26',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'K_POP',
              },
              created_at: '2022-01-17T07:19:02.780325Z',
              updated_at: '2022-01-17T07:19:02.780325Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
          ],
          users: [],
        },
        foreign_id: '0595b3a1-4a83-4e08-8c9d-db9717f916d7',
        id: 'c6799890-98ab-11ec-8080-800045fc4212',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {
            testsendmail: {
              id: '70',
              data: {
                username: 'testsendmail',
                fullname: 'mai test send mail',
                avatar:
                  'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              },
              created_at: '2022-02-21T09:03:25.777129Z',
              updated_at: '2022-02-21T09:03:25.777129Z',
            },
          },
          groups: {},
        },
        object: {
          id: '6cf14c4b-e7c9-4f76-9111-e575987e7733',
          collection: 'post',
          foreign_id: 'post:6cf14c4b-e7c9-4f76-9111-e575987e7733',
          data: {
            content: '@testsendmail Create post auto with group(s) as audience',
            files: [],
            images: [
              {
                height: 440,
                name: '21dc554d-fd3f-4b38-8845-9e327e586db9.jpg',
                origin_name: '1b5-660x440.jpg',
                width: 660,
              },
            ],
            videos: [],
          },
          created_at: '2022-02-28T15:33:15.37218Z',
          updated_at: '2022-02-28T15:33:27.502793Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T15:33:27.833000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T15:33:27.881711',
    group: 'c6799890-98ab-11ec-8080-800045fc4212',
    id: 'c681075c-98ab-11ec-8080-800130406d7d.c6799890-98ab-11ec-8080-800045fc4212',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T15:33:27.881711',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '26',
              collection: 'groups',
              foreign_id: 'groups:26',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'K_POP',
              },
              created_at: '2022-01-17T07:19:02.780325Z',
              updated_at: '2022-01-17T07:19:02.780325Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
          ],
          users: [],
        },
        foreign_id: 'de725922-c219-48f7-8daa-649f562de5c0',
        id: '4a243840-98ab-11ec-8080-800118e6249b',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {
            testsendmail: {
              id: '70',
              data: {
                username: 'testsendmail',
                fullname: 'mai test send mail',
                avatar:
                  'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              },
              created_at: '2022-02-21T09:03:25.777129Z',
              updated_at: '2022-02-21T09:03:25.777129Z',
            },
          },
          groups: {},
        },
        object: {
          id: '7f9d75b2-e81b-43a6-b0b3-ea0e2c857c91',
          collection: 'post',
          foreign_id: 'post:7f9d75b2-e81b-43a6-b0b3-ea0e2c857c91',
          data: {
            content: '@testsendmail Create post auto with group(s) as audience',
            files: [],
            images: [
              {
                height: 440,
                name: '32e727fd-36e6-46a2-afe8-999cf8610a68.jpg',
                origin_name: '1b5-660x440.jpg',
                width: 660,
              },
            ],
            videos: [],
          },
          created_at: '2022-02-28T15:29:47.054068Z',
          updated_at: '2022-02-28T15:29:58.902988Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T15:29:59.236000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T15:29:59.309741',
    group: '4a243840-98ab-11ec-8080-800118e6249b',
    id: '4a2f78c4-98ab-11ec-8080-80002d36154e.4a243840-98ab-11ec-8080-800118e6249b',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T15:29:59.309741',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '26',
              collection: 'groups',
              foreign_id: 'groups:26',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'K_POP',
              },
              created_at: '2022-01-17T07:19:02.780325Z',
              updated_at: '2022-01-17T07:19:02.780325Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
          ],
          users: [],
        },
        foreign_id: '9043a069-a4c9-495f-ab3d-6a97c035a551',
        id: 'b4252c00-98aa-11ec-8080-800079807621',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {
            testsendmail: {
              id: '70',
              data: {
                username: 'testsendmail',
                fullname: 'mai test send mail',
                avatar:
                  'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              },
              created_at: '2022-02-21T09:03:25.777129Z',
              updated_at: '2022-02-21T09:03:25.777129Z',
            },
          },
          groups: {},
        },
        object: {
          id: '2c79445d-a3ee-4c65-9f21-1c1f0a3cdef6',
          collection: 'post',
          foreign_id: 'post:2c79445d-a3ee-4c65-9f21-1c1f0a3cdef6',
          data: {
            content: '@testsendmail Create post auto with group(s) as audience',
            files: [],
            images: [
              {
                height: 440,
                name: '67892c85-aa3c-4fcc-957d-e62d32c94cc8.jpg',
                origin_name: '1b5-660x440.jpg',
                width: 660,
              },
            ],
            videos: [],
          },
          created_at: '2022-02-28T15:25:27.445336Z',
          updated_at: '2022-02-28T15:25:47.124877Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T15:25:47.584000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T15:25:47.645697',
    group: 'b4252c00-98aa-11ec-8080-800079807621',
    id: 'b42e960a-98aa-11ec-8080-800173c40220.b4252c00-98aa-11ec-8080-800079807621',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T15:25:47.645697',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '26',
              collection: 'groups',
              foreign_id: 'groups:26',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'K_POP',
              },
              created_at: '2022-01-17T07:19:02.780325Z',
              updated_at: '2022-01-17T07:19:02.780325Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
          ],
          users: [],
        },
        foreign_id: '7268ac18-ecf7-48f6-a83b-38e3c0af0742',
        id: '36b4e5d0-98aa-11ec-8080-800066075359',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {
            testsendmail: {
              id: '70',
              data: {
                username: 'testsendmail',
                fullname: 'mai test send mail',
                avatar:
                  'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
              },
              created_at: '2022-02-21T09:03:25.777129Z',
              updated_at: '2022-02-21T09:03:25.777129Z',
            },
          },
          groups: {},
        },
        object: {
          id: '4620ff60-13f0-4ea5-81fb-b819e0b4c5d9',
          collection: 'post',
          foreign_id: 'post:4620ff60-13f0-4ea5-81fb-b819e0b4c5d9',
          data: {
            content: '@testsendmail Create post auto with group(s) as audience',
            files: [],
            images: [
              {
                height: 440,
                name: 'e22dc14d-d214-4779-a465-405d4e83cd91.jpg',
                origin_name: '1b5-660x440.jpg',
                width: 660,
              },
            ],
            videos: [],
          },
          created_at: '2022-02-28T15:22:06.04667Z',
          updated_at: '2022-02-28T15:22:16.812699Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T15:22:17.133000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T15:22:17.189694',
    group: '36b4e5d0-98aa-11ec-8080-800066075359',
    id: '36bd8c6d-98aa-11ec-8080-8000685e0d5a.36b4e5d0-98aa-11ec-8080-800066075359',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T15:22:17.189694',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
            {
              id: '7',
              collection: 'groups',
              foreign_id: 'groups:7',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Bein Community',
              },
              created_at: '2022-01-14T07:44:45.922123Z',
              updated_at: '2022-01-14T07:44:45.922123Z',
            },
            {
              id: '26',
              collection: 'groups',
              foreign_id: 'groups:26',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'K_POP',
              },
              created_at: '2022-01-17T07:19:02.780325Z',
              updated_at: '2022-01-17T07:19:02.780325Z',
            },
            {
              id: '30',
              collection: 'groups',
              foreign_id: 'groups:30',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Exo',
              },
              created_at: '2022-01-17T07:46:27.076707Z',
              updated_at: '2022-01-17T07:46:27.076707Z',
            },
            {
              id: '32',
              collection: 'groups',
              foreign_id: 'groups:32',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Lisa',
              },
              created_at: '2022-01-17T08:32:14.664599Z',
              updated_at: '2022-01-17T08:32:14.664599Z',
            },
            {
              id: '35',
              collection: 'groups',
              foreign_id: 'groups:35',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'One piece fan club',
              },
              created_at: '2022-01-18T03:57:14.749174Z',
              updated_at: '2022-01-18T03:57:14.749174Z',
            },
            {
              id: '75',
              collection: 'groups',
              foreign_id: 'groups:75',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: '28022022-Test Remove group',
              },
              created_at: '2022-02-28T07:13:51.477126Z',
              updated_at: '2022-02-28T07:13:51.477126Z',
            },
          ],
          users: [],
        },
        foreign_id: 'b7683dd0-61e5-44eb-8727-78521e261bd4',
        id: '84ec49c0-987b-11ec-8080-80014eeb902a',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '195a5dc9-61f0-4f80-95fe-198d9ad00bcf',
          collection: 'post',
          foreign_id: 'post:195a5dc9-61f0-4f80-95fe-198d9ad00bcf',
          data: {
            content: 'Comment',
            files: [],
            images: [],
            videos: [],
          },
          created_at: '2022-02-28T09:47:55.952369Z',
          updated_at: '2022-02-28T09:48:01.58285Z',
        },
        origin: 'timeline:g-7',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T09:48:02.012000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T09:48:02.024558',
    group: '84ec49c0-987b-11ec-8080-80014eeb902a',
    id: '84ee3451-987b-11ec-8080-800163776f4d.84ec49c0-987b-11ec-8080-80014eeb902a',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T09:48:02.024558',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
          ],
          users: [],
        },
        foreign_id: '0d6b4838-08dd-4331-af2f-0a5965306d23',
        id: '798a2a20-987b-11ec-8080-800127fe6c4b',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: 'f370e14e-91f5-4d4b-b557-eb0f05ad6dec',
          collection: 'post',
          foreign_id: 'post:f370e14e-91f5-4d4b-b557-eb0f05ad6dec',
          data: {
            content: 'Join',
            files: [],
            images: [],
            videos: [],
          },
          created_at: '2022-02-28T09:47:40.989874Z',
          updated_at: '2022-02-28T09:47:42.415134Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T09:47:42.914000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T09:47:42.926329',
    group: '798a2a20-987b-11ec-8080-800127fe6c4b',
    id: '798c0bc0-987b-11ec-8080-800030d43850.798a2a20-987b-11ec-8080-800127fe6c4b',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T09:47:42.926329',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:41.376328Z',
          updated_at: '2022-03-02T11:24:16.159454Z',
          id: '12',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/987806da-a2cb-4a44-b728-3431ea575c92.jpg',
            fullname: 'Nguyễn Thị Ngọc Linh',
          },
        },
        audience: {
          groups: [
            {
              id: '6',
              collection: 'groups',
              foreign_id: 'groups:6',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'EVOL Community',
              },
              created_at: '2022-01-14T07:42:18.184353Z',
              updated_at: '2022-01-14T07:42:18.184353Z',
            },
          ],
          users: [],
        },
        foreign_id: '49b49e55-4e2a-43ae-8500-4644037b4212',
        id: '717bc960-987b-11ec-8080-80012fbcde4e',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '67cbb248-76ae-4dbd-bada-1bc4574d7f6e',
          collection: 'post',
          foreign_id: 'post:67cbb248-76ae-4dbd-bada-1bc4574d7f6e',
          data: {
            content: 'Test delete comment 1',
            files: [],
            images: [],
            videos: [],
          },
          created_at: '2022-02-28T09:47:24.547622Z',
          updated_at: '2022-02-28T09:47:29.070699Z',
        },
        origin: 'timeline:g-6',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T09:47:29.398000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T09:47:29.410862',
    group: '717bc960-987b-11ec-8080-80012fbcde4e',
    id: '717dbfd3-987b-11ec-8080-800123bee33c.717bc960-987b-11ec-8080-80012fbcde4e',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T09:47:29.410862',
    verb: 'post',
  },
  {
    activities: [
      {
        actor: {
          created_at: '2022-01-14T04:58:45.776555Z',
          updated_at: '2022-03-01T08:18:56.458626Z',
          id: '20',
          data: {
            avatar:
              'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/user/avatar/Avatar_Profile.png',
            fullname: 'Trần Nam Anh',
          },
        },
        audience: {
          groups: [
            {
              id: '7',
              collection: 'groups',
              foreign_id: 'groups:7',
              data: {
                icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
                name: 'Bein Community',
              },
              created_at: '2022-01-14T07:44:45.922123Z',
              updated_at: '2022-01-14T07:44:45.922123Z',
            },
          ],
          users: [],
        },
        foreign_id: 'b13514b7-2b37-441c-9ef4-f544418b3955',
        id: 'df2719c0-9875-11ec-8080-80016109e0ba',
        important: {
          active: 0,
          expires_time: '',
        },
        is_draft: false,
        mentions: {
          users: {},
          groups: {},
        },
        object: {
          id: '2327034e-217f-4c28-8161-eb01c589c807',
          collection: 'post',
          foreign_id: 'post:2327034e-217f-4c28-8161-eb01c589c807',
          data: {
            content: 'test delete comment',
            files: [],
            images: [],
            videos: [],
          },
          created_at: '2022-02-28T09:07:28.911228Z',
          updated_at: '2022-02-28T09:07:36.086577Z',
        },
        origin: 'timeline:g-7',
        settings: {
          can_comment: true,
          can_react: true,
          can_share: true,
        },
        target: '',
        time: '2022-02-28T09:07:36.412000',
        type: 'post',
        verb: 'post',
      },
    ],
    activity_count: 1,
    actor_count: 1,
    created_at: '2022-02-28T09:07:36.425320',
    group: 'df2719c0-9875-11ec-8080-80016109e0ba',
    id: 'df292217-9875-11ec-8080-8001602518f6.df2719c0-9875-11ec-8080-80016109e0ba',
    is_read: false,
    is_seen: true,
    updated_at: '2022-02-28T09:07:36.425320',
    verb: 'post',
  },
];
