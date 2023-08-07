export const mockCommunityResponse = {
  code: 'api.ok',
  data: [
    {
      communityId: '55b974bf-34dd-4f99-af21-d1c79f90aa90',
      name: 'community',
      enable: true,
    },
  ],
  meta: {
    message: 'OK',
  },
};

export const mockGroupResponse = {
  code: 'api.ok',
  data: [
    {
      communityId: '55b974bf-34dd-4f99-af21-d1c79f90aa90',
      groupId: '1f8308a3-f589-4572-85b9-08a525e64dc3',
      name: 'group',
      enable: true,
      channels: {
        inApp: true,
        push: true,
      },
      flag: {
        value: false,
        label: 'Default',
      },
    },
    {
      communityId: '55b974bf-34dd-4f99-af21-d1c79f90aa90',
      groupId: '24f838a8-8974-41c6-8442-9149aa1eb5c0',
      name: 'group',
      enable: true,
      channels: {
        inApp: true,
        push: true,
      },
      flag: {
        value: false,
        label: 'Default',
      },
    },
    {
      communityId: '55b974bf-34dd-4f99-af21-d1c79f90aa90',
      groupId: '4ec6f1ce-53d0-4276-bb57-73f21851d394',
      name: 'group',
      enable: true,
      channels: {
        inApp: true,
        push: true,
      },
      flag: {
        value: false,
        label: 'Default',
      },
    },
  ],
  meta: {
    message: 'OK',
  },
};

export const mockGroupInFlat = {
  code: 'api.ok',
  meta: {
    message: 'Success',
    total: 7,
    offset: 0,
    limit: 20,
    hasNextPage: false,
  },
  data: [
    {
      id: 'c157e820-de96-45a9-be74-5e36be83ff03',
      community_id: '55b974bf-34dd-4f99-af21-d1c79f90aa90',
      parent_id: '24f838a8-8974-41c6-8442-9149aa1eb5c0',
      name: 'Group inner một 111',
      slug: 'group-inner-mot',
      description: 'ujuj',
      level: 4,
      privacy: 'PRIVATE',
      parents: [
        '4fe3bf00-d638-402f-886c-d7aabbef31b0',
        '4ec6f1ce-53d0-4276-bb57-73f21851d394',
        '647f7c72-4921-4a4a-9b59-8a5c1445cd68',
        '24f838a8-8974-41c6-8442-9149aa1eb5c0',
      ],
      icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
      background_img_url: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      created_at: '2022-12-02T02:57:52.220Z',
      updated_at: '2023-07-17T10:54:20.997Z',
      user_count: 17,
    },
    {
      id: '4fa1d1cd-a616-408d-9860-b7f5e50ab96c',
      community_id: '55b974bf-34dd-4f99-af21-d1c79f90aa90',
      parent_id: 'c157e820-de96-45a9-be74-5e36be83ff03',
      name: 'Groupba33333333333333333333333333333333333333333333333333333333',
      slug: 'group-ba',
      description: null,
      level: 5,
      privacy: 'PRIVATE',
      parents: [
        '4fe3bf00-d638-402f-886c-d7aabbef31b0',
        '4ec6f1ce-53d0-4276-bb57-73f21851d394',
        '647f7c72-4921-4a4a-9b59-8a5c1445cd68',
        '24f838a8-8974-41c6-8442-9149aa1eb5c0',
        'c157e820-de96-45a9-be74-5e36be83ff03',
      ],
      icon: 'https://media.beincom.app/image/variants/group/avatar/d7b84ae8-007c-4b81-bf15-b02d866630c4',
      background_img_url: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      created_at: '2023-06-30T10:06:34.792Z',
      updated_at: '2023-07-18T09:27:56.706Z',
      user_count: 6,
    },
    {
      id: '901ca828-72a3-4446-9fcf-f3c5fb757380',
      community_id: '55b974bf-34dd-4f99-af21-d1c79f90aa90',
      parent_id: '4fe3bf00-d638-402f-886c-d7aabbef31b0',
      name: 'Group hai',
      slug: 'group-hai',
      description: 'sfdfsdfsdfsdf',
      level: 1,
      privacy: 'CLOSED',
      parents: [
        '4fe3bf00-d638-402f-886c-d7aabbef31b0',
      ],
      icon: 'https://media.beincom.app/image/variants/group/avatar/acc410c7-fbce-4bac-9463-5981369e6085',
      background_img_url: 'https://media.beincom.app/image/variants/group/cover/11ae114d-d143-410b-856f-5fe5a8f317c6',
      created_at: '2022-12-02T02:58:14.497Z',
      updated_at: '2023-07-14T02:38:09.436Z',
      user_count: 27,
    },
  ],
};

export const mockCommunitySearchResponse = {
  code: 'api.ok',
  meta: {
    message: 'Success',
    total: 11,
    offset: 0,
    limit: 20,
    hasNextPage: false,
  },
  data: [
    {
      id: '34e70efc-297f-4ee9-9ff3-99239e4c096e',
      name: 'Test sync archive to Chat',
      slug: '5723ae424e4a',
      icon: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
      level: 0,
      privacy: 'OPEN',
      parents: [],
      parent_id: null,
      created_at: '2023-01-31T08:13:28.732Z',
      updated_at: '2023-01-31T08:13:29.148Z',
      description: 'sdasda',
      community_id: 'b03addd7-1792-4662-82d2-fd9d9b3c8c41',
      background_img_url: 'https://bic-stg-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
    },
    {
      id: 'c3b9a925-5b6e-4baf-b9e3-2718448395f1',
      name: 'EVOL 11999 Cường Test Final Nguyễn Ngọc Cường Cường Test Ngọc',
      slug: '950587db295b',
      icon: 'https://media.beincom.app/image/variants/group/avatar/c5c58f81-01a3-4af3-8778-5e21a6e31341',
      level: 0,
      privacy: 'OPEN',
      parents: [],
      parent_id: null,
      created_at: '2022-07-05T11:12:26.366Z',
      updated_at: '2023-07-24T09:39:14.200Z',
      description: 'EVOL Cường Test Final Cường Test Final Cường Test Final Cường TeEVOL Cường Test Final Cường Test Final Cường Test Final Cường TeEVOL Cường Test Final Cường Test Final Cường Test Final Cường TeEVOL Cường Test Final Cường Test Final Cường Test Final Cường T',
      community_id: '6b9b33dc-5a52-478f-8f31-76ce27e6b2e7',
      background_img_url: 'https://media.beincom.app/image/variants/group/cover/5b71fdf4-7425-49c9-8bc0-71a7161d60f6',
    },
  ],
};
