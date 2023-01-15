export const responseOwnCommunity = {
  code: 'api.ok',
  meta: {
    message: 'Success',
  },
  data: [
    {
      id: '88b95fe1-be57-4bb8-b414-30737db1052b',
      groupId: '98d4f395-05f0-488e-b38d-371dbb8a89a7',
      name: 'Hội những ng thích nhạc bolero',
      privacy: 'PUBLIC',
      slug: '186f8c8a2460',
      description: 'ahihi',
      icon: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/avatar/Avatar_Group.png',
      backgroundImgUrl: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
      userCount: 1,
    },
  ],
};

export const responseManage = {
  code: 'api.ok',
  meta: {
    message: 'Success',
    total: 3,
    offset: 0,
    limit: 25,
    hasNextPage: false,
  },
  data: [
    {
      id: '2b15df32-ac56-47d8-ac63-aaa2dd199d00',
      name: 'Community của Tèo',
      icon: 'https://evolgroup.vn/wp-content/uploads/sites/18/2020/04/Thumb-EVOL.jpg',
      level: 0,
      parents: [],
      privacy: 'PUBLIC',
      slug: '72880b4b1e35',
      description: '123. Tuy nhiên, trong cuộc họp báo sau trận đấu Philippines, HLV Park khẳng định: Kết quả giữa Malaysia và Thái Lan chẳng liên quan tới trận đấu của Việt Nam. Tôi cũng không tính toán gì từ trận đấu đó',
      backgroundImgUrl: 'https://bein-entity-attribute-stg.s3.ap-southeast-1.amazonaws.com/group/cover/default_group_cover.png',
      community: {
        id: 'e32a2676-0fbe-4900-a00d-e2825329b24e',
        name: 'Community của Tèo',
        groupId: '2b15df32-ac56-47d8-ac63-aaa2dd199d00',
      },
      userCount: 13,
    },
    {
      id: 'c8ddd4d4-9a5e-4d93-940b-e332a8d0422d',
      name: 'Bein Community',
      icon: null,
      level: 1,
      parents: [
        '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      ],
      privacy: 'PUBLIC',
      slug: '863b7fce-2a88-4441-aa24-4803f7b6d1ec-1641834908',
      description: null,
      backgroundImgUrl: null,
      community: {
        id: '15337361-1577-4b7b-a31d-990df06aa446',
        name: 'EVOL Community',
        groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      },
      userCount: 24,
    },
    {
      id: '928d15c3-8225-4197-8189-63907f17093d',
      name: 'Crypto Inner Circle',
      icon: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/a6d32c52-c622-4600-bb89-f28b1510047b',
      level: 1,
      parents: [
        '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      ],
      privacy: 'PUBLIC',
      slug: 'crypto-inner-circle-1641809088',
      description: 'https://fe.sbx.beincomm.com/groups/2',
      backgroundImgUrl: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/group/cover/images/original/072b78ab-25d3-462f-b5d7-43644d9b9f80',
      community: {
        id: '15337361-1577-4b7b-a31d-990df06aa446',
        name: 'EVOL Community',
        groupId: '35b5fb8f-6f7a-4ac2-90bb-18199096c429',
      },
      userCount: 31,
    },
  ],
};
