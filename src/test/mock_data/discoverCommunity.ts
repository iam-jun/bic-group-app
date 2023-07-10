import GroupJoinStatus from '~/constants/GroupJoinStatus';

export const mockDiscoverCommunityResponse = {
  code: 'api.ok',
  meta: {
    message: 'Success',
    total: 114,
    offset: 0,
    limit: 25,
    hasNextPage: true,
  },
  data: [
    {
      id: '406b5420-7a1c-4bba-8e3b-315b857a9eaf',
      name: '[Test] Comm của Hưng',
      slug: '694d4ccf30d3',
      privacy: 'PRIVATE',
      description: '',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/group/avatar/images/original/0063c09a-6c50-4257-844e-62ff4ae8e24b',
      backgroundImgUrl: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      userCount: 9,
      members: [
        {
          id: '83608d8a-dfcf-4d55-9367-6fd5a27851f0',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/058b13b6-4acc-469f-9c86-22f64d31193b',
        },
        {
          id: '45a7942e-0369-4c78-9915-1aeb46463172',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/206550db-26f1-4115-80dc-98134e4d8590.webp',
        },
        {
          id: '077d4420-3c80-41d9-89ec-0da039657629',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/608635c7-af37-4db3-91c5-b48ed5ac6864.jpg',
        },
      ],
      joinStatus: GroupJoinStatus.VISITOR,
    },
    {
      id: 'b5e5612c-e253-4b5a-8a5f-9eb5f350c43b',
      name: '[Test] Phuoc',
      slug: 'f46e3bb6bde0',
      privacy: 'OPEN',
      description: 'Test',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
      backgroundImgUrl: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      userCount: 4,
      members: [
        {
          id: '6ff1dc17-62a0-4172-9d53-561f91f0336a',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
        },
        {
          id: '077d4420-3c80-41d9-89ec-0da039657629',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/608635c7-af37-4db3-91c5-b48ed5ac6864.jpg',
        },
        {
          id: 'bccaa231-2b5d-4548-8ec0-17ce7a4eaf68',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/42053054-e3ea-4453-8e05-2f2e7e3d6611.png',
        },
      ],
      joinStatus: GroupJoinStatus.MEMBER,
    },
    {
      id: '8841299c-6e51-486f-b5da-a4cc0d84706b',
      name: '[Test] Phuoc1',
      slug: 'a62ad7fc640c',
      privacy: 'OPEN',
      description: 'aaaaaa',
      icon: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-avatar.png',
      backgroundImgUrl: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/group/default-cover.png',
      userCount: 4,
      members: [
        {
          id: '9496b102-63bb-4ee1-b46b-70592a64d12f',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
        },
        {
          id: '77e6a3b9-e4d6-4b22-a7c5-94d3c699975f',
          avatar: 'https://picsum.photos/200',
        },
        {
          id: 'bccaa231-2b5d-4548-8ec0-17ce7a4eaf68',
          avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/42053054-e3ea-4453-8e05-2f2e7e3d6611.png',
        },
      ],
      joinStatus: GroupJoinStatus.REQUESTED,
    },
  ],
};
